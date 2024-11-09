"use client";
import { loginWithSpotify } from "@/src/lib/auth/spotify.auth";
import { Playlist, usePlaylistStore } from "@/src/store/Playlist.store";
import { useSessionStore } from "@/src/store/Session.store";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Input,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import Step from "../stepper/Step";
import { IPlaylistItem } from "@/src/interface/youtube.interface";
import { MessageCircleWarning } from "lucide-react";

const SpotifyConverter = () => {
  const playlist = usePlaylistStore((state) => state.playlist);
  const spotifyStatus = useSessionStore((state) => state.spotifyStatus);
  const [name, setName] = useState<string>("tes");
  const [confirmed, setConfirmed] = useState<string[]>([])
  const [idArray, setIdArray] = useState<string[]>([]);

  useEffect(() => {
    usePlaylistStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (playlist) {
      const mapped = playlist.map(item => item.id);
      setIdArray(mapped);
    }
  }, [playlist])
  
  //CLICK SUR LES CHECKBOX CLASSIQUES
  const onCheckBoxChange = (event : React.ChangeEvent<HTMLInputElement>	) => {
    const { value, checked } = event.target;
    console.log('EVENT : ', value, checked);
    if (checked) {
      setConfirmed(prev => [...prev, value]);
      return;
    }
    const filtered = confirmed.filter(item => item !== value);
    setConfirmed(prev => filtered);
  }

  const onSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    if (checked) {
      return setConfirmed(idArray);
    }
    setConfirmed([]);
  }

  //SI PAS DE PLAYLIST
  if (!playlist) {
    return <div>No playlist to convert 🥲</div>;
  }

  //SI L'USER N'EST PAS LOG
  if (spotifyStatus && spotifyStatus !== "Authenticated") {
    return (
      <div>
        <h2>You need to be logged in on your Spotify account</h2>
        <Button onClick={() => loginWithSpotify()}>Login on Spotify</Button>
      </div>
    );
  }

  //NOM DE LA PLAYLIST

  //RESUME DES TRACKS A AJOUTER

  //EN PREMIERE ON CREE LA PLAYLIST ET ON RECUPERE SON ID

  //ENSUITE ON AJOUTE LES TRACKS

  //MERCI ET BONNE JOURNEE

  return (
    <div>
      <Step index={1} title="Name your new playlist">
        <Input
          type="text"
          variant="bordered"
          onValueChange={setName}
          value={name}
          classNames={{
            inputWrapper: ["group-data-[focus=true]:border-white"],
          }}
        />
        <p className="text-xs mt-2">
          The name have to be 3 characters length minimum.
        </p>
      </Step>
      {name && name.length >= 3 && (
        <Step index={2} title="Playlist summary">
          <div className="flex gap-1 items-start text-yellow-500 mb-4">
            <MessageCircleWarning />
            <p>
              Keep in mind the convert result may be inaccurate, please
              check the tracks found below and select wich ones want to keep for
              your new playlist.
            </p>
          </div>
          <Checkbox isSelected={idArray.length === confirmed.length} onChange={onSelectAllClick}>
            <div className="flex gap-3 text-emerald-400 font-semibold">
              Select / Unselect All
            </div>
          </Checkbox>
          <hr className="border-0 border-t border-gray-600 my-3"></hr>
          <CheckboxGroup value={confirmed}>
            {playlist.map((item) => (
              <Checkbox onChange={onCheckBoxChange} key={item.id} value={item.id}>
                <div className="flex gap-3 text-gray-300">
                  <p>{item.title}</p>-<p>{item.artist}</p>
                </div>
              </Checkbox>
            ))}
          </CheckboxGroup>
        </Step>
      )}
    </div>
  );
};

export default SpotifyConverter;
