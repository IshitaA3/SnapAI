import { Download, Image, Images, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useAuth } from "@clerk/clerk-react"
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImage = () => {

  const imageStyles = ['Realistic Style', 'Ghibli Style', 'Anime Style', 'Cartoon Style', 'Fantasy Style', '3D Style', 'Portrait Style']
  const [selectedStyle, setSelectedStyle] = useState(imageStyles[0])
  const [input, setInput] = useState('')
  const [publish, setPublish] = useState(false)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      setContent('')
      
      const prompt = `Generate an image of ${input} in ${selectedStyle}`
      const {data} = await axios.post('api/ai/generate-image', {prompt, publish}, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      })

      if (data.success) {
        setContent(data.content)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)  
    }
    setLoading(false)
  }

  const handleDownload = async () => {
    const response = await fetch(content)
    const blob = await response.blob()

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = url
    a.download = "ai-image.png"
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className='h-full overflow-y-scroll p-6 text-slate-700 flex items-start gap-4 flex-wrap'>
      {/* left column */}
      <form onSubmit={handleSubmit} className='border border-gray-200 w-full rounded-lg max-w-lg bg-white p-4'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#00AD25]' />
          <h1 className='text-xl font-semibold'>AI Image Generator</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Describe Your Image</p>

        <textarea 
        rows={4}
        className='w-full rounded-md p-2 px-3 mt-2 outline-none text-sm border border-gray-300' 
        placeholder='Tell us what you want to see in the image...'
        onChange={(e) => setInput(e.target.value)}
        value={input}
        required 
        />

        <p className='mt-4 text-sm font-medium'>Style</p>
        
        <div className='mt-3 flex flex-wrap gap-3 sm:max-w-9/11'>
          {
            imageStyles.map((item) => (
              <span key={item}
              onClick={() => setSelectedStyle(item)}
              className={`text-xs rounded-full py-1 px-4 cursor-pointer border ${(selectedStyle === item) ? 'bg-green-50 text-green-700' : 'text-gray-500 border-gray-300'}`}>{item}</span>
            ))
          }
        </div>

        <div className='my-6 flex items-center gap-2'>
          <label className='relative cursor-pointer'>
            <input type="checkbox" onChange={(e) => setPublish(e.target.checked)} checked={publish} className='sr-only peer' />
            <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition'></div>
            <span className='absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4'></span>
          </label>
          <p className='text-sm'>Make this image Public</p>
        </div>

        <button disabled={loading} className='w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 rounded-lg text-white text-sm cursor-pointer bg-linear-to-r from-[#00AD25] to-[#04FF50]'>
          {loading ? <span className='border-2 border-t-transparent animate-spin rounded-full w-4 h-4 my-1'></span> : <Image className='w-5'/>}
          Generate Image
        </button>
      </form>

      {/* right column */}
      <div className='flex flex-col w-full max-w-lg p-4 bg-white rounded-lg min-h-96 border border-gray-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Image className='w-5 h-5 text-[#00AD25]' />
            <h1 className='text-xl font-semibold'>Generated Image</h1>
          </div>

          {content && (
            <button
              onClick={handleDownload}
              className='flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 cursor-pointer transition'
            >
              <Download className='w-3.5 h-3.5'/>
              Download
            </button>
          )}
        </div>
        {
          !content ? (
            <div className='flex justify-center items-center flex-1'>
              <div className='flex flex-col items-center gap-5 text-sm text-gray-400'>
                <Image className='w-9 h-9' />
                <p>Your image will appear here once generated.</p>
              </div>
            </div>
          
          ) : (
            <div className='h-full mt-3'>
              <img src={content} alt="image" className='w-full h-full' />
            </div>
          )
        }
      </div>
    </div>
  )
}

export default GenerateImage