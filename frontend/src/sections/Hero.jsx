import React from 'react'
import Updates from '../components/Updates'
import WeatherWidget from '../components/WeatherWidget'
import Task from '../components/Task'
import CropDetailsForm from '../components/Crop_Details'

const Hero = () => {
  return (
    <div>
      <Updates/>
      <div className='w-full flex flex-col lg:flex-row items-start justify-center gap-6 pt-10 px-4 max-w-6xl mx-auto'>
        <WeatherWidget/>
        <Task/>
      </div>
      <div>
        <CropDetailsForm/>
      </div>
    </div>
  )
}

export default Hero
