import { Download, Eraser, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useAuth } from "@clerk/clerk-react"
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      setContent('')
      
      const formData = new FormData()
      formData.append('image', input)

      const { data } = await axios.post('/api/ai/remove-image-background', formData, {
        headers: {Authorization: `Bearer ${await getToken()}`}
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
    a.download = "background-removed-image.png"
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className='h-full overflow-y-scroll p-6 text-slate-700 flex items-start gap-4 flex-wrap'>
      {/* left column */}
      <form onSubmit={handleSubmit} className='border border-gray-200 w-full rounded-lg max-w-lg bg-white p-4'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#FF4938]' />
          <h1 className='text-xl font-semibold'>Remove Background</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Upload Image</p>

        <input 
        type="file" 
        className='w-full rounded-md p-2 px-3 mt-2 outline-none text-sm border border-gray-300 text-gray-600 cursor-pointer' 
        onChange={(e) => setInput(e.target.files[0])}
        accept='image/*'
        required 
        />
        <p className='text-xs text-gray-500 font-light mt-1'>Supports JPG, PNG, and other image formats</p>

        <button disabled={loading} className='w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 rounded-lg text-white text-sm cursor-pointer bg-linear-to-r from-[#F6AB41] to-[#FF4938]'>
          {loading ? <span className='border-t-transparent border-2 animate-spin h-4 w-4 my-1 rounded-full'></span> : <Eraser className='w-5'/>}
          Remove Background
        </button>
        
      </form>

      {/* right column */}
      <div className='flex flex-col w-full max-w-lg p-4 bg-white rounded-lg min-h-96 border border-gray-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Eraser className='w-5 h-5 text-[#FF4938]' />
            <h1 className='text-xl font-semibold'>Processed Image</h1>
          </div>

          {content && (
            <button
              onClick={handleDownload}
              className='flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 cursor-pointer transition'
            >
              <Download className='w-3.5 h-3.5' />
              Download
            </button>
          )}
        </div>
        {
          !content ? (
            <div className='flex justify-center items-center flex-1'>
              <div className='flex flex-col items-center gap-5 text-sm text-gray-400'>
                <Eraser className='w-9 h-9' />
                <p>Upload an image and your result will show up here</p>
              </div>
            </div>
          ) : (
            <div className='h-full mt-3'>
              <img src={content} alt="image" className='w-full h-full mt-3' />
            </div>
          )
        }
        
      </div>

    </div>
  )
}

export default RemoveBackground