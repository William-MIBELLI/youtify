import SpotifyConverter from '@/src/components/converter/SpotifyConverter'
import React from 'react'

const page = async () => {
  return (
    <div className='container'>
      <h1 className='title'>
        Few more steps and it's done !
      </h1>
      <SpotifyConverter/>
    </div>
  )
}

export default page