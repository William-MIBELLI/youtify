import React, { FC } from 'react'

interface IProps {
  searchParams: Promise<{[key:string]: string | string[] | undefined}>
}

const page: FC<IProps> = async ({ searchParams }) => {

  const { error } = await searchParams;
  return (
    <div className='w-full flex justify-center mt-40'>
      <h2 className='text-gray-300 flex gap-1'>
        <span className='font-semibold text-gray-400'>
          Authentication Error : 
        </span>
        <span className='text-gray-200'>
          {error || 'Something wents wrong... 🤔'}
        </span>
      </h2>
    </div>
  )
}

export default page