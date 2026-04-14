import React, { useEffect, useState } from 'react'
import { Gem, Sparkles } from 'lucide-react'
import { Protect } from '@clerk/clerk-react'
import CreationItem from '../components/CreationItem'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {

  const [creations, setCreations] = useState([])
  const [loading, setLoading] = useState(true)
  
  const { getToken } = useAuth();
  
  const getDashboardData = async () => {
    try {

      const { data } = await axios.get('/api/user/user-creations', {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      })

      if (data.success) {
        setCreations(data.creations)
      } else {
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    getDashboardData();
  }, [])

  return (
    <div className='p-6 h-full overflow-y-scroll'>
      {/* cards */}
      <div className='flex justify-start flex-wrap gap-4'>
        {/* card 1 */}
        <div className='flex justify-between items-center w-72 p-4 px-6 border border-gray-200 rounded-xl bg-white'>
          <div className='text-slate-600'>
            <p className='text-sm'>Total Creations</p>
            <h2 className='text-xl font-semibold'>{creations?.length}</h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-linear-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center'>
            <Sparkles className='w-5 text-white' />
          </div>
        </div>
        {/* card 2 */}
        <div className='flex justify-between items-center w-72 p-4 px-6 border border-gray-200 rounded-xl bg-white'>
          <div className='text-slate-600'>
            <p className='text-sm'>Active Plan</p>
            <h2 className='text-xl font-semibold'>
              <Protect plan="premium" fallback="Free" >Premium</Protect>
            </h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-linear-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center'>
            <Gem className='w-5 text-white' />
          </div>
        </div>
      </div>
      {/* recent creations */}
      {
        !loading ? (
          <div className='space-y-3'>
            <p className='mt-6 mb-4'>Recent Creations</p>
            {
              creations?.map((item) => <CreationItem key={item._id} item={item} />)
            }
          </div>
        ) : (
          <div className='h-3/4 flex justify-center items-center'>
            <span className='h-11 w-11 rounded-full border-3 border-purple-500 border-t-transparent animate-spin'></span>
          </div>
        )
      }
      
    </div>
  )
}

export default Dashboard