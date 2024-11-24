"use client";
import { loginWithSpotify } from "@/src/lib/auth/spotify.auth";
import { Playlist, usePlaylistStore } from "@/src/store/Playlist.store";
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
import { createSpotifyPlaylistACTION, globalCreatePlaylistACTION } from "@/src/lib/action/creation.action";
import { redirect } from "next/navigation";
import Track from "./Track";
import { loginWithGoogle } from "@/src/lib/auth/google.auth";

const SpotifyConverter = () => {
  // const playlist = usePlaylistStore((state) => state.playlist);
  // const spotifyStatus = useSessionStore((state) => state.spotifyStatus);
  // const spotifyData = useSessionStore((state) => state.spotifyData);
  const addLink = usePlaylistStore((state) => state.addLink);
  const removePlaylist = usePlaylistStore((state) => state.removePlaylist);
  const playListstore = usePlaylistStore((state) => state);
  const sessionStore = useSessionStore((state) => state);
  const [name, setName] = useState<string>();
  const [confirmed, setConfirmed] = useState<string[]>([]);
  const [idArray, setIdArray] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    usePlaylistStore.persist.rehydrate();
    useSessionStore.persist.rehydrate();
  }, []);

  //AU MONTAGE, ON RECUPERE TOUS LES ID
  // useEffect(() => {
  //   if (playlist) {
  //   }
  // }, [playlist]);
  useEffect(() => {
    console.log('SESSION : ', sessionStore);
    console.log('PLAYLISIT : ', playListstore);
  },[playListstore, sessionStore])

  useEffect(() => {
    const { playlist, origin } = playListstore;
    const { googleData, spotifyData } = sessionStore;
    if (playlist) {
      const mapped = playlist.map((item) => item[0].id);
      setIdArray(mapped);
    }
    if (origin) {
      setUserId(origin === "spotify" ? spotifyData?.id : googleData?.id);
    }
  }, [playListstore]);

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
      //ON RECUPERE LE 1ER ID DE CHAQUE PLAYLIST
      const ids: string[] = [];
      idArray.forEach((item) => ids.push(item));
      return setConfirmed(ids);
    }
    setConfirmed([]);
  };

  //CLICK DANS LES RADIOGROUPS
  const updatePlaylist = (pl: Playlist, trackId: string) => {
    //ON RECUPERE L'ITEM AVEC LE TRACKID
    const track = pl.find((item) => item.id === trackId);

    if (!track) {
      return;
    }

    //ON REMOVE L'ID DU 1ER ELEMENT DES SELECTED SI IL Y ETAIT
    const newConfirmed = confirmed.filter((item) => item !== pl[0].id);
    newConfirmed.push(track.id);
    setConfirmed(newConfirmed);

    //ON MET A JOUR L'IDARRAY
    const newIdArray = idArray.filter((id) => id !== pl[0].id);
    newIdArray.push(track.id);
    setIdArray(newIdArray);
  };

  //SUBMIT
  const [state, action] = useFormState(
    globalCreatePlaylistACTION.bind(null, confirmed),
    undefined
  );

  //GESTION DU RETOUR DU SUBMIT
  useEffect(() => {
    if (state && !state?.success) {
      setError(state.error);
      return;
    }

    if (state?.success && state.playlistLink) {
      setError(undefined);

      //ON UPDATE LE STORE
      addLink(state.playlistLink);
      removePlaylist();

      //ET ON REDIRECT
      redirect("/success");
    }
  }, [state]);

  //SI PAS DE PLAYLIST
  if (!playListstore.playlist) {
    return <div>No playlist to convert 🥲</div>;
  }

  //SI L'USER N'EST PAS LOG
  if (
    (playListstore.origin === "spotify" &&
      sessionStore.googleStatus !== "Authenticated") ||
    (playListstore.origin === "youtube" &&
      sessionStore.spotifyStatus !== "Authenticated")
  ) {
    return (
      <div>
        <h2>
          You need to be logged in your{" "}
          {playListstore.origin === "spotify" ? "Google" : "Spotify"} account
        </h2>
        {playListstore.origin === "youtube" ? (
          <Button
            className="my-3 text-gray-300"
            variant="bordered"
            onClick={loginWithSpotify}
          >
            Log in Spotify
          </Button>
        ) : (
          <Button
            className="my-3 text-gray-300"
            variant="bordered"
            onClick={loginWithGoogle}
          >
            Log in Youtube
          </Button>
        )}
      </div>
    );
  }

  return (
    <form action={action} noValidate>
      <input type="text" name="userId" hidden defaultValue={userId} />
      <input type="text" name="origin" hidden defaultValue={playListstore.origin} />
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
          <Radio
            classNames={{
              label: ["text-gray-300"],
              wrapper: ["group-data-[focus=true]:border-white"],
            }}
            value={"public"}
          >
            Public
          </Radio>
          <Radio
            classNames={{
              label: ["text-gray-300"],
              wrapper: ["group-data-[focus=true]:border-white"],
            }}
            value={"private"}
          >
            Private
          </Radio>
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

          {/* GLOBAL SELECT */}
          <Checkbox
            isSelected={idArray.length === confirmed.length}
            onChange={onSelectAllClick}
          >
            <div className="flex gap-3 text-emerald-400 font-semibold">
              Select / Unselect All
            </div>
          </Checkbox>
          <hr className="border-0 border-t border-gray-600 my-3"></hr>

          {/* CHECKBOX LIST */}
          <CheckboxGroup value={confirmed}>
            {playListstore.playlist.map((item) => (
              <Track
                key={item[0].id}
                changeHandler={onCheckBoxChange}
                tracks={item}
                updatePlaylist={updatePlaylist}
              />
            ))}
          </CheckboxGroup>

          {/* SUBMIT BUTTON */}
          <div className="my-8">
            <Button type="submit" fullWidth>
              Let's convert
            </Button>
          </div>
        </Step>
      )}
    </form>
  );
};

export default SpotifyConverter;
