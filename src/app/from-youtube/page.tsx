import YoutubeStepper from '@/src/components/stepper/YoutubeStepper'
import { Button } from '@nextui-org/react'
import React from 'react'

const page = async () => {
  return (
    <div className="h-auto w-3/4 mx-auto flex flex-col gap-5 mt-16 text-gray-400 ">
      <h2 className="title text-white">From Youtube to Spotify</h2>
      <YoutubeStepper/>
    </div>
  )
}

export default page