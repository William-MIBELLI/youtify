import YoutubeStepper from '@/src/components/stepper/YoutubeStepper'
import { Button } from '@nextui-org/react'
import React from 'react'

const page = async () => {
  return (
    <div className="container">
      <h2 className="title text-white">From Youtube to Spotify</h2>
      <YoutubeStepper/>
    </div>
  )
}

export default page