import { Edit, Sparkles, Copy, Check } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from "@clerk/clerk-react"
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {

  const articleLength = [
    {length: 800, text: 'Short (500-800 words)'},
    {length: 1200, text: 'Medium (800-1200 words)'},
    {length: 1600, text: 'Long (1200+ words)'},
  ]
  const [selectedLength, setSelectedLength] = useState(articleLength[0])
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
      const prompt = `Write a complete article about "${input}". 
      Target word count: ${selectedLength.length} words. 
      The article must be fully complete — do not stop in the middle of a sentence or paragraph. 
      Make sure the last paragraph is a proper closing.
      `
      const { data } = await axios.post('/api/ai/generate-article', {prompt, length: selectedLength.length}, {
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
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>AI Article Writer</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Article Topic</p>

        <input 
        type="text" 
        className='w-full rounded-md p-2 px-3 mt-2 outline-none text-sm border border-gray-300' 
        placeholder='Enter a topic to get started..'
        onChange={(e) => setInput(e.target.value)}
        value={input}
        required 
        />

        <p className='mt-4 text-sm font-medium'>Article length</p>
        
        <div className='mt-3 flex flex-wrap gap-3 sm:max-w-9/11'>
          {
            articleLength.map((item, index) => (
              <span key={index}
              onClick={() => setSelectedLength(item)}
              className={`text-xs rounded-full py-1 px-4 cursor-pointer border ${(selectedLength.text === item.text) ? 'bg-blue-50 text-blue-700' : 'text-gray-500 border-gray-300'}`}>{item.text}</span>
            ))
          }
        </div>

        <br />
        <button 
        disabled={loading}
        className='w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 rounded-lg text-white text-sm cursor-pointer bg-linear-to-r from-[#226BFF] to-[#65ADFF]'>
          {
            loading ?
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
            : <Edit className='w-5'/>
          }
          Generate Article
        </button>
      </form>

      {/* right column */}
      <div className='flex flex-col w-full max-w-lg p-4 bg-white rounded-lg max-h-150 min-h-96 border border-gray-200'>
       <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Edit className='w-5 h-5 text-[#4A7AFF]' />
            <h1 className='text-xl font-semibold'>Generated Article</h1>
          </div>
          {content && (
            <button
              onClick={handleCopy}
              className='flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 cursor-pointer transition'
            >
              {copied ? <Check className='w-3.5 h-3.5 text-green-500' /> : <Copy className='w-3.5 h-3.5' />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
        {!content ? (
          <div className='flex justify-center items-center flex-1'>
          <div className='flex flex-col items-center gap-5 text-sm text-gray-400'>
            <Edit className='w-9 h-9' />
            <p>Your article will appear here once it's ready.</p>
          </div>
        </div>
        ) : (
          <div className='mt-3 h-full overflow-y-auto pb-6 text-sm text-slate-600'>
            <div className='reset-tw'>
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WriteArticle