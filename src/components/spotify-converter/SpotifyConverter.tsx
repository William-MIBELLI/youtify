"use client";
import { loginWithSpotify } from "@/src/lib/auth/spotify.auth";
import { usePlaylistStore } from "@/src/store/Playlist.store";
import { useSessionStore } from "@/src/store/Session.store";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Radio,
  RadioGroup,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import Step from "../stepper/Step";
import { MessageCircleWarning } from "lucide-react";
import { useFormState } from "react-dom";
import { createSpotifyPlaylistACTION } from "@/src/lib/action/creation.action";

const SpotifyConverter = () => {
  const playlist = usePlaylistStore((state) => state.playlist);
  const spotifyStatus = useSessionStore((state) => state.spotifyStatus);
  const spotifyData = useSessionStore((state) => state.spotifyData);
  const [name, setName] = useState<string>();
  const [confirmed, setConfirmed] = useState<string[]>([]);
  const [idArray, setIdArray] = useState<string[]>([]);

  useEffect(() => {
    usePlaylistStore.persist.rehydrate();
    useSessionStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (playlist) {
      const mapped = playlist.map((item) => item.id);
      setIdArray(mapped);
    }
  }, [playlist]);

  //CLICK SUR LES CHECKBOX CLASSIQUES
  const onCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setConfirmed((prev) => [...prev, value]);
      return;
    }
    const filtered = confirmed.filter((item) => item !== value);
    setConfirmed((prev) => filtered);
  };

  const onSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    if (checked) {
      return setConfirmed(idArray);
    }
    setConfirmed([]);
  };

  const [state, action] = useFormState(createSpotifyPlaylistACTION.bind(null, confirmed), undefined);

  //SI PAS DE PLAYLIST
  if (!playlist) {
    return <div>No playlist to convert 🥲</div>;
  }

  //SI L'USER N'EST PAS LOG
  if (!spotifyStatus || !spotifyData || spotifyStatus !== "Authenticated") {
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
    <form action={action} noValidate>
      <input type="text" name="userId" hidden defaultValue={spotifyData.id}/>
      {/* PLAYLIST NAME */}
      <Step index={1} title="Name your new playlist and set its visibility">
        <Input
          name="title"
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

        {/* PLAYLIST VISIBILITY */}
        <RadioGroup
          name="visibility"
          orientation="horizontal"
          defaultValue={"public"}
          className="mt-4"
          label="Visibility"
          classNames={{
            label: ["text-emerald-400 font-semibold"],
            wrapper: ["group-data-[focus=true]:border-white"],

          }}
          
        >
          <Radio classNames={{
            label: ["text-gray-300"],
            wrapper: ["group-data-[focus=true]:border-white"],
          }} value={"public"}>Public</Radio>
          <Radio classNames={{
            label: ["text-gray-300"],
            wrapper: ["group-data-[focus=true]:border-white"],
          }} value={"private"}>Private</Radio>
        </RadioGroup>
      </Step>

      {/* TRACKS LIST */}
      {name && name.length >= 3 && (
        <Step index={2} title="Playlist summary">
          <div className="flex gap-1 items-start text-yellow-500 mb-4">
            <MessageCircleWarning />
            <p>
              Keep in mind the convert result may be inaccurate, please check
              the tracks found below and select wich ones you want to keep for
              your new playlist.
            </p>
          </div>
          <Checkbox
            isSelected={idArray.length === confirmed.length}
            onChange={onSelectAllClick}
          >
            <div className="flex gap-3 text-emerald-400 font-semibold">
              Select / Unselect All
            </div>
          </Checkbox>
          <hr className="border-0 border-t border-gray-600 my-3"></hr>
          <CheckboxGroup value={confirmed}>
            {playlist.map((item) => (
              <Checkbox
                onChange={onCheckBoxChange}
                key={item.id}
                value={item.id}
              >
                <div className="flex gap-3 text-gray-300">
                  <p>{item.title}</p>-<p>{item.artist}</p>
                </div>
              </Checkbox>
            ))}
          </CheckboxGroup>
          <div className="my-4">
            <Button type="submit" fullWidth>Let's convert</Button>
          </div>
        </Step>
      )}
    </form>
  );
};

export default SpotifyConverter;
