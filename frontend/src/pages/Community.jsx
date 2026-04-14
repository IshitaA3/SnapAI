import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { Heart } from 'lucide-react';
import { useAuth } from "@clerk/clerk-react"
import axios from 'axios'
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {

  const [creations, setCreations] = useState([])
  const [loading, setLoading] = useState(true)

  const { getToken } = useAuth();

  const { user } = useUser();

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get('/api/user/published-creations', {
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

  const imageLikeToggle = async (id) => {

    const updatedCreations = creations.map((item) => {
      if (item._id === id) {
        const isLiked = item.likes.includes(user.id)

         toast.success(isLiked ? "Creation Unliked" : "Creation Liked")

        return {
          ...item,
          likes: isLiked
            ? item.likes.filter((u) => u !== user.id)
            : [...item.likes, user.id]
        }
      }
      return item
    })

    setCreations(updatedCreations)

    try {
      const { data } = await axios.post('/api/user/toggle-like-creations', {id}, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      })
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if(user) {
      fetchCreations();
    }
  },[user])

  return !loading ? (
    <div className='flex flex-1 gap-4 p-6 flex-col h-full'>
      Creations 
      <div className='h-full w-full bg-white rounded-xl overflow-y-scroll'>
        {
          creations?.map((creation, index) => (
            <div key={index} className='relative inline-block group pt-3 pl-3 w-full sm:max-w-1/2 lg:max-w-1/3'>
              <img src={creation.content}
              alt=""
              className='w-full h-full object-cover rounded-lg'
              />
              <div className='absolute left-3 bottom-0 right-0 top-0 flex gap-2 justify-end items-end group-hover:justify-between p-3 group-hover:bg-linear-to-b from-transparent to-black/80 text-white rounded-lg'>
                <p className='text-sm hidden group-hover:block'>{creation.prompt}</p>
                <div className='flex items-center gap-1'>
                  <p>{creation.likes?.length}</p>
                  <Heart onClick={() => imageLikeToggle(creation._id)} className={`min-w-5 h-5 hover-scale-110 cursor-pointer ${creation.likes.includes(user.id) ? 'fill-red-500 text-red-600' : 'text-white'}`} />
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  ) : (
    <div className='h-full flex justify-center items-center'>
      <span className='h-10 w-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin'></span>
    </div>
  )
}

export default Community