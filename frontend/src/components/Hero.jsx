import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';

const Hero = () => {

  const navigate = useNavigate();

  return (
    <div className='relative inline-flex flex-col px-4 sm:px-20 xl:px-32 w-full justify-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen'>
        <div className='text-center mb-6'>
            <h1 className='text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto'>
                Bring your ideas to life <br/> using <span className='text-primary'>AI magic</span>
            </h1>
            <p className='mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto text-gray-600 max-sm:text-xs'>
                From stunning visuals to compelling articles, our AI tools do the heavy 
  lifting so you can focus on what matters most.
            </p>
        </div>
        <div className='flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs'>
            <button className='bg-primary text-white px-10 py-3 rounded-lg 
            hover:scale-102 active:scale-95 transition cursor-pointer '
            onClick={() => navigate('/ai')} >Start creating now</button>
            <button className='bg-white text-primary px-10 py-3 rounded-lg border border-gray-300 
            hover:scale-102 active:scale-95 transition cursor-pointer' >Watch demo</button>
        </div>
        <div className='flex items-center gap-4 mt-8 mx-auto text-gray-600'>
            <img src={assets.user_group} alt="users" className='h-8' />
            <p>Trusted by 10k+ people</p>
        </div>
    </div>
  )
}

export default Hero