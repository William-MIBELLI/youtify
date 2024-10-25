'use client';
import React, { useState } from 'react'
import Input from '../input/Input';

const Stepper = () => {

  const [user, setUser] = useState<string>();
  
  return (
    <div className='w-full flex flex-col gap-5'>
      <div className='flex items-center w-full gap-3'>
        <div className='flex justify-center items-center w-10 h-10 mr-5  bg-gray-400 text-gray-950 font-semibold rounded-full'>
          <p>
            1
          </p>
        </div>
          <div>
            <p className=''>Select an user</p>
            <Input/>
          </div>
      </div>
      <hr className='border-0 border-t border-gray-600'></hr>
    </div>
  )
}

export default Stepper