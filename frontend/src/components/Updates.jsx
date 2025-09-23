import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud, faTasks, faMapMarkerAlt, faThermometerHalf } from '@fortawesome/free-solid-svg-icons';

const Updates = () => {
  return (
    <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 max-w-4xl mx-auto'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-semibold text-gray-800'>Quick Updates</h2>
        <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
      </div>

      {/* Weather and Tasks Cards - Side by Side */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
        {/* Weather Card */}
        <div className='bg-gradient-to-r from-blue-50 to-sky-50 p-4 rounded-lg border border-blue-100 hover:border-blue-200 transition-colors duration-300'>
          <div className='flex items-center gap-3'>
            <div className='bg-blue-100 rounded-full p-2 flex-shrink-0'>
              <FontAwesomeIcon icon={faCloud} className="text-blue-600" />
            </div>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-1 mb-1'>
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500 text-xs" />
                <span className="text-xs font-medium text-gray-600 truncate">Mangalgiri</span>
              </div>
              <div className='flex items-center justify-between'>
                <div className='min-w-0'>
                  <p className='text-sm font-medium text-gray-700 truncate'>Partly Cloudy</p>
                  <p className='text-xs text-gray-500'>Good for farming</p>
                </div>
                <div className='text-right flex-shrink-0'>
                  <div className='flex items-center gap-1'>
                    <FontAwesomeIcon icon={faThermometerHalf} className="text-blue-500 text-xs" />
                    <span className='text-lg font-bold text-gray-800'>29°C</span>
                  </div>
                  <p className='text-xs text-gray-500'>Feels 32°C</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Card */}
        <div className='bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100 hover:border-green-200 transition-colors duration-300'>
          <div className='flex items-center gap-3'>
            <div className='bg-green-100 rounded-full p-2 flex-shrink-0'>
              <FontAwesomeIcon icon={faTasks} className="text-green-600" />
            </div>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center justify-between mb-2'>
                <div className='min-w-0'>
                  <p className='text-sm font-medium text-gray-700'>Daily Tasks</p>
                  <p className='text-xs text-gray-600'>3 pending today</p>
                </div>
                <div className='flex-shrink-0'>
                  <div className='bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-medium'>
                    Active
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <div className='flex-1 bg-gray-200 rounded-full h-1.5'>
                  <div className='bg-green-500 h-1.5 rounded-full' style={{width: '60%'}}></div>
                </div>
                <span className='text-xs text-gray-500 flex-shrink-0'>60%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
     
    </div>
  )
}

export default Updates
