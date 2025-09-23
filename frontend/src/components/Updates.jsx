import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud,faTasks  } from '@fortawesome/free-solid-svg-icons';
const Updates = () => {
  return (
    <div className='flex items-center justify-center pt-[150px] space-x-10 font-semibold'>
      <div className='border-1 border-blue-500  p-3.5 rounded-3xl  gap-1.5 flex items-center justify-center text-black-50'>
        <div>
            <FontAwesomeIcon icon={faCloud} size="2x" color="blue" />
        </div>
        <div>
            Today Weather
        </div>
            </div>
      <div className='border-1 border-[#009688] p-3.5 rounded-3xl  gap-1.5 flex items-center justify-center text-black-50'>
        <div>
            <FontAwesomeIcon icon={faTasks} size="2x" color="#009688" />
        </div>
        <div>
            Task to do
        </div>
            </div>
    </div>
  )
}

export default Updates
