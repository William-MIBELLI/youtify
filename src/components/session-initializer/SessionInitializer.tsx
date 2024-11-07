'use client';
import { AuthenticationStatus, GoogleUserData } from '@/src/interface/auth.interface';
import { useSessionStore } from '@/src/store/Session.store';
import React, { FC, useEffect } from 'react'

interface IProps {
  googleData: {
    data: GoogleUserData | null,
    status: AuthenticationStatus
  }
}

const SessionInitializer: FC<IProps> = ({ googleData }) => {

  const setGoogle = useSessionStore(state => state.setGoogle);
  const google = useSessionStore(state => state.googleData);


  //ON REHYDRATE AU MONTAGE
  useEffect(() => {
    useSessionStore.persist.rehydrate();
  }, [])
  
  useEffect(() => {
    console.log('ON RENTRE DANS LE USEEFFECT DINITLIASE', google, googleData);
    setGoogle(googleData.data || undefined, googleData.status);
  },[googleData, setGoogle])

  return null
}

export default SessionInitializer