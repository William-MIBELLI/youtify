'use client';
import { useSpotifyContext } from '@/src/context/spotifySession/SpotifySession.context';
import { SpotifyToken } from '@/src/interface/spotify.interface';
import { useRouter } from 'next/navigation';
import React, { FC, useEffect } from 'react'

interface IProps {
  token: SpotifyToken
}

const AuthCompleteClient: FC<IProps> = ({ token }) => {
  
  const { setToken } = useSpotifyContext();
  const router = useRouter();
  useEffect(() => {
    setToken(token);
    router.push('/');
  }, [token])
  
  return (
    <div>AuthCompleteClient</div>
  )
}

export default AuthCompleteClient