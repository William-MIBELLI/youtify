"use client";
import {
  IPlaylistTracksList,
  IUserPlaylist,
} from "@/src/interface/spotify.interface";
import { searchSpotifyUserPlaylistACTION } from "@/src/lib/action/spotify.action";
import { getPlaylistTracks } from "@/src/lib/request/spotify.request";
import { Button, Input } from "@nextui-org/react";
import { Search, TriangleAlert } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import StepIndex from "./StepIndex";
import Step from "./Step";
import TrackSelector from "../trackSelector/TrackSelector";
import SearchInput from "../input/SearchInput";
import { mapSpotifyPlaylist } from "@/src/lib/helpers/mapper";
import { loginWithSpotify } from "@/src/lib/auth/spotify.auth";
import { useSessionStore } from "@/src/store/Session.store";

const SpotifyStepper = () => {
  const [tracks, setTracks] = useState<IPlaylistTracksList>();
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>();
  const [playlists, setPlaylists] = useState<IUserPlaylist>();
  const sessionStore = useSessionStore((state) => state);

  const [state, action] = useFormState(
    searchSpotifyUserPlaylistACTION,
    undefined
  );

  useEffect(() => {
    useSessionStore.persist.rehydrate();
  }, []);

  const onPlaylistClick = async (playlistId: string) => {
    //SI LA PLAYLIST EST DEJA SELECTED, ON FAST RETURN
    if (selectedPlaylist === playlistId) {
      return;
    }

    //ON FETCH LES DATAS
    const data = await getPlaylistTracks(playlistId);
    if (!data) {
      return;
    }

    //ON UPDATE LE STATE
    setTracks((previous) => data);
    setSelectedPlaylist(playlistId);
  };

  //SI ON A CHERCHE UN NOUVEL USER, ON RESET LES TRACKS
  useEffect(() => {
    setPlaylists(state?.playlist);
    setTracks(undefined);
  }, [state]);

  const onLoginClick = async () => {
    await loginWithSpotify();
  };

  return (
    <div className="w-full flex flex-col gap-5">
    

      {/* SELECT USER */}
      <Step index={1} title="Select an user">
        <form action={action} noValidate className="">
          <SearchInput name={"userId"} />
          <div className="flex gap-1 items-center text-yellow-500">
            <TriangleAlert />
            <p>
              The search is processing on the user ID and not the DisplayName.
            </p>
          </div>
        </form>
        {state?.error && (
          <div className="text-xs text-center text-red-500 mt-5">
            {state.error}
          </div>
        )}

        {sessionStore.spotifyStatus === "Authenticated" && (
          <div className="mt-4 flex items-center gap-2">
            <p>Or you can retrieve your playlist by clicking here</p>
            <form action={action}>
              <input
                type="text"
                name="userId"
                hidden
                defaultValue={sessionStore.spotifyData?.id || undefined}
              />
              <Button
                type="submit"
                variant="bordered"
                className="text-gray-200"
              >
                Get my playlists
              </Button>
            </form>
          </div>
        )}
      </Step>

      {/* SELECT PLAYLIST */}
      {playlists && (
        <Step index={2} title="Select a playlist">
          <div>
            <div className="grid grid-cols-3">
              {playlists.items.map((item) => (
                <div
                  onClick={() => onPlaylistClick(item.id!)}
                  className={`  ${
                    selectedPlaylist === item.id
                      ? "text-emerald-400 font-semibold cursor-default"
                      : "cursor-pointer hover:text-gray-200"
                  }`}
                  key={item.id || Math.random()}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </Step>
      )}

      {/* TRACKS LIST */}
      {tracks && (
        <TrackSelector from="spotify" playlist={mapSpotifyPlaylist(tracks)} />
      )}
      <div className="h-20"></div>
    </div>
  );
};

export default SpotifyStepper;
