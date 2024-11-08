'use client'
import { loginWithSpotify } from '@/src/lib/auth/spotify.auth';
import { usePlaylistStore } from '@/src/store/Playlist.store';
import { Button } from '@nextui-org/react';
import React, { useEffect, useState } from 'react'

const SpotifyConverter = () => {

  const [userConnected, setUserConnected] = useState<boolean>();
  const playlist = usePlaylistStore(state => state.playlist);
    
  console.log('PLKAYLIST : ', playlist);

  useEffect(() => {
    usePlaylistStore.persist.rehydrate();
  }, []);

  //SI PAS DE PLAYLIST
  if (!playlist) {
    return (
      <div>
        No playlist to convert 🥲
      </div>
    )
  }


  
  if (!userConnected) {
    return (
      <div>
        <h2>
          You need to be logged in on your Spotify account 
        </h2>
        <Button onClick={() => loginWithSpotify()}>Login on Spotify</Button>
      </div>
    )
  }


  //NOM DE LA PLAYLIST

  //RESUME DES TRACKS A AJOUTER

  //EN PREMIERE ON CREE LA PLAYLIST ET ON RECUPERE SON ID

  //ENSUITE ON AJOUTE LES TRACKS

  //MERCI ET BONNE JOURNEE

  return (
    <div>SpotifyConverter</div>
  )
}

export default SpotifyConverter