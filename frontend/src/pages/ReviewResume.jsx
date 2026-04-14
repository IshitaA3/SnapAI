import { File, FileText, Sparkles, Copy, Check } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useAuth } from "@clerk/clerk-react"
import axios from 'axios'
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [copied, setCopied] = useState(false)

  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      setContent('')

      const formData = new FormData()
      formData.append('resume', input)

      const { data } = await axios.post('/api/ai/resume-review', formData, {
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

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className='h-full overflow-y-scroll p-6 text-slate-700 flex items-start gap-4 flex-wrap'>
      {/* left column */}
      <form onSubmit={handleSubmit} className='border border-gray-200 w-full rounded-lg max-w-lg bg-white p-4'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#00DA83]' />
          <h1 className='text-xl font-semibold'>Review Your Resume</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Upload Resume</p>

        <input 
        type="file" 
        className='w-full rounded-md p-2 px-3 mt-2 outline-none text-sm border border-gray-300 text-gray-600 cursor-pointer' 
        onChange={(e) => setInput(e.target.files[0])}
        accept='application/pdf'
        required 
        />
        <p className='text-xs text-gray-500 font-light mt-1'>Supports PDF format under 5MB.</p>

        <button disabled={loading} className='w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 rounded-lg text-white text-sm cursor-pointer bg-linear-to-r from-[#00DA83] to-[#009BB3]'>
          {loading ? <span className='border-2 border-t-transparent w-4 h-4 my-1 animate-spin rounded-full'></span> : <FileText className='w-5'/>}
          Review Resume
        </button>
        
      </form>

      {/* right column */}
      <div className='flex flex-col w-full max-w-lg p-4 bg-white rounded-lg min-h-96 border border-gray-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <FileText className='w-5 h-5 text-[#00DA83]' />
            <h1 className='text-xl font-semibold'>Detailed Review</h1>
          </div>
          {content && (
            <button
              onClick={handleCopy}
              className='flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 cursor-pointer transition'
            >
              {copied ? (
                <Check className='w-3.5 h-3.5 text-green-500' />
              ) : (
                <Copy className='w-3.5 h-3.5' />
              )}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
        {
          !content ? (
            <div className='flex justify-center items-center flex-1'>
              <div className='flex flex-col items-center gap-5 text-sm text-gray-400'>
                <FileText className='w-9 h-9' />
                <p>Your resume analysis will appear here once ready.</p>
              </div>
            </div>
          ) : (
            <div className='h-full overflow-y-auto mt-3 pb-6 text-sm text-slate-600'>
              <div className='reset-tw'>
                <Markdown>{content}</Markdown>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default ReviewResume