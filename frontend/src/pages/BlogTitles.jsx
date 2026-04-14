import { Hash, Sparkles, Copy, Check } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useAuth } from "@clerk/clerk-react"
import axios from 'axios'
import Markdown from 'react-markdown';


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {

  const blogCategories = ['General', 'Technology', 'Business', 'Health', 'Lifestyle', 'Travel', 'Education', 'Food']
  const [selectedCategory, setSelectedCategory] = useState(blogCategories[0])
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

      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory} in less than 800 words.`
      const {data} = await axios.post('api/ai/generate-blog-title', {prompt}, {
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
          <Sparkles className='w-6 text-[#8E37EB]' />
          <h1 className='text-xl font-semibold'>AI Title Generator</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Keyword</p>

        <input 
        type="text" 
        className='w-full rounded-md p-2 px-3 mt-2 outline-none text-sm border border-gray-300' 
        placeholder='Enter a keyword to get started...'
        onChange={(e) => setInput(e.target.value)}
        value={input}
        required 
        />

        <p className='mt-4 text-sm font-medium'>Category</p>
        
        <div className='mt-3 flex flex-wrap gap-3 sm:max-w-9/11'>
          {
            blogCategories.map((item) => (
              <span key={item}
              onClick={() => setSelectedCategory(item)}
              className={`text-xs rounded-full py-1 px-4 cursor-pointer border ${(selectedCategory === item) ? 'bg-purple-50 text-purple-700' : 'text-gray-500 border-gray-300'}`}>{item}</span>
            ))
          }
        </div>

        <br />
        <button disabled={loading} className='w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 rounded-lg text-white text-sm cursor-pointer bg-linear-to-r from-[#C341F6] to-[#8E37EB]'>
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Hash className='w-5'/>}
          Generate Title
        </button>
        
      </form>

      {/* right column */}
      <div className='flex flex-col w-full max-w-lg p-4 bg-white rounded-lg min-h-96 border border-gray-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Hash className='w-5 h-5 text-[#8E37EB]' />
            <h1 className='text-xl font-semibold'>Generated Titles</h1>
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
        {
          !content ? (
            <div className='flex justify-center items-center flex-1'>
              <div className='flex flex-col items-center gap-5 text-sm text-gray-400'>
                <Hash className='w-9 h-9' />
                <p>Your titles will appear here once generated.</p>
              </div>
            </div>
          ) : (
            <div className='h-full mt-3 overflow-y-auto pb-6 text-sm text-slate-600'>
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

export default BlogTitles