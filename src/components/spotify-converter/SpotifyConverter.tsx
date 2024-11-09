'use client'
import { loginWithSpotify } from '@/src/lib/auth/spotify.auth';
import { usePlaylistStore } from '@/src/store/Playlist.store';
import { useSessionStore } from '@/src/store/Session.store';
import { Button, Checkbox, CheckboxGroup, Input } from '@nextui-org/react';
import React, { useEffect, useState } from 'react'
import Step from '../stepper/Step';
import { IPlaylistItem } from '@/src/interface/youtube.interface';

const SpotifyConverter = () => {

  const playlist = usePlaylistStore(state => state.playlist);
  const spotifyStatus = useSessionStore(state => state.spotifyStatus)
  const [name, setName] = useState<string>();
    

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

  //SI L'USER N'EST PAS LOG
  if (spotifyStatus && spotifyStatus !== "Authenticated") {
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
    <div>
      <Step index={1} title='Name your new playlist'>
        <Input type='text' variant='bordered' onValueChange={setName} classNames={{
          'inputWrapper':[
            'group-data-[focus=true]:border-white'
          ]
        }} />
        <p className='text-xs mt-2'>
          The name have to be 3 characters length minimum.
        </p>
      </Step>
      {
        (name && name.length >= 3) && (
          <Step index={2} title='Playlist summary'>
            <CheckboxGroup>
              {
                playlist.map(item => (
                  <Checkbox>
                    <div className='flex gap-3'>
                      <p>
                        {item.title}
                      </p>
                      <p>
                        {item.artist}
                      </p>
                    </div>
                  </Checkbox>
                ))
              }
            </CheckboxGroup>
          </Step>
        )
      }
    </div>
  )
}

export default SpotifyConverter