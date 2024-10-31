"use client";
import {
  IPlaylistTracksList,
  IUserPlaylist,
} from "@/src/interface/spotify.interface";
import { searchSpotifyUserPlaylistACTION } from "@/src/lib/action/spotify.action";
import { getPlaylistTracks } from "@/src/lib/request/spotify.request";
import { Button, Input } from "@nextui-org/react";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import StepIndex from "./StepIndex";
import Step from "./Step";
import TrackSelector from "../trackSelector/TrackSelector";
import SearchInput from "../input/SearchInput";
import { mapSpotifyPlaylist } from "@/src/lib/helpers/mapper";

const SpotifyStepper = () => {

  const [tracks, setTracks] = useState<IPlaylistTracksList>();
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>();
  const [playlists, setPlaylists] = useState<IUserPlaylist>();

  const [state, action] = useFormState(
    searchSpotifyUserPlaylistACTION,
    undefined
  );

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

  return (
    <div className="w-full flex flex-col gap-5">
      {/* SELECT USER */}
      <Step index={1} title="Select an user">
        <form action={action} noValidate className="">
          <SearchInput name={'userId'} />
        </form>
      {state?.error && (
        <div className="text-xs text-center text-red-500 mt-5">{state.error}</div>
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
      {tracks && <TrackSelector playlist={mapSpotifyPlaylist(tracks)} />}
      <div className="h-20"></div>
    </div>
  );
};

export default SpotifyStepper;
