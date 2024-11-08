'use client';
import { useSessionStore } from '@/src/store/Session.store';
import React, { useEffect } from 'react'
import AuthDetails from './AuthDetails';
import { Divider } from '@nextui-org/react';

const AuthDisplayer = () => {

  const googleStatus = useSessionStore(state => state.googleStatus);
  const spotifyStatus = useSessionStore(state => state.spotifyStatus);
  const googleData = useSessionStore(state => state.googleData);
  const spotifyData = useSessionStore(state => state.spotifyData);

  useEffect(() => {
    useSessionStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    console.log('STATUS DANS LE STORE : ', googleData, spotifyData);
  },[googleData, spotifyData])

  return (
    <div className='flex  gap-2'>
      <AuthDetails provider='google' status={googleStatus} />
      <Divider orientation='vertical' className='bg-white'/>
      <AuthDetails provider='spotify' status={spotifyStatus}  />
    </div>
  )
}

export default AuthDisplayer