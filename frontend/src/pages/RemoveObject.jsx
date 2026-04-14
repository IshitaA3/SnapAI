import { Scissors, Sparkles, Download } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useAuth } from "@clerk/clerk-react"
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {

  const [input, setInput] = useState('')
  const [object, setObject] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      setContent('')

      if (object.split(' ').length > 1) {
        toast.error('Please enter only one object name')
        setLoading(false)
      }

      const formData = new FormData()
      formData.append('image', input)
      formData.append('object', object)

      const { data } = await axios.post('/api/ai/remove-image-object', formData, {
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
    a.download = "object-removed-image.png"

    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className='h-full overflow-y-scroll p-6 text-slate-700 flex items-start gap-4 flex-wrap'>
      {/* left column */}
      <form onSubmit={handleSubmit} className='border border-gray-200 w-full rounded-lg max-w-lg bg-white p-4'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>AI Object Remover</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Upload Image</p>

        <input 
        type="file" 
        className='w-full rounded-md p-2 px-3 mt-2 outline-none text-sm border border-gray-300 text-gray-600 cursor-pointer' 
        onChange={(e) => setInput(e.target.files[0])}
        accept='image/*'
        required 
        />

        <p className='mt-6 text-sm font-medium'>Name the object</p>
        <textarea 
        rows={4}
        className='w-full rounded-md p-2 px-3 mt-2 outline-none text-sm border border-gray-300' 
        placeholder='Keep it simple — one object at a time'
        onChange={(e) => setObject(e.target.value)}
        value={object}
        required 
        />

        <button disabled={loading} className='w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 rounded-lg text-white text-sm cursor-pointer bg-linear-to-r from-[#417DF6] to-[#8E37EB]'>
          {loading ? <span className='w-4 h-4 rounded-full border-2 border-t-transparent animate-spin my-1'></span> : <Scissors className='w-5'/>}
          Remove Object
        </button>
        
      </form>

      {/* right column */}
      <div className='flex flex-col w-full max-w-lg p-4 bg-white rounded-lg min-h-96 border border-gray-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Scissors className='w-5 h-5 text-[#4A7AFF]' />
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
                <Scissors className='w-9 h-9' />
                <p>Your image will appear here once the object is removed</p>
              </div>
            </div>
          ) : (
            <div className='h-full mt-3'>
              <img src={content} alt="image" className='mt-3 w-ful h-full' />
            </div>
          )
        }
        
      </div>

    </div>
  )
}

export default RemoveObject