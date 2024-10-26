"use client";
import { IPlaylistTracksList, ISpotifyToken } from "@/src/interface/spotify.interface";
import { searchSpotifyUserPlaylistACTION } from "@/src/lib/action/spotify.action";
import { getPlaylistTracks } from "@/src/lib/request/spotify.request";
import { Button, Input } from "@nextui-org/react";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";

const Stepper = () => {
  
  const [tracks, setTracks] = useState<IPlaylistTracksList>();
  const [state, action] = useFormState(
    searchSpotifyUserPlaylistACTION,
    undefined
  );

  const onPlaylistClick = async (playlistId: string) => {
    console.log('CLICK PLAYLIST : ', playlistId);
    const data = await getPlaylistTracks(playlistId);
    if (!data) {
      return;
    }
    setTracks(previous => data);
  }

  useEffect(() => {
    console.log('STATE : ', state);
  }, [state]);

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex items-center w-full gap-3">
        <div className="flex justify-center items-center w-10 h-10 mr-5  bg-gray-400 text-gray-950 font-semibold rounded-full">
          <p>1</p>
        </div>
        <form action={action} noValidate>
          <p className="">Select an user</p>
          <div className="flex gap-2">
            <Input variant="bordered" name="userId" />
            <Button
              type="submit"
              endContent={<Search size={20} />}
              isIconOnly
            />
          </div>
        </form>
      </div>
      {
        state?.error && (
          <div className="text-xs text-center text-red-500">
            {state.error}
          </div>
        )
      }
      <hr className="border-0 border-t border-gray-600"></hr>
      <div>
        {state?.playlist && (
          <div>
            <div className="grid grid-cols-3">
              {state.playlist.items.map((item) => (
                <div onClick={() => onPlaylistClick(item.id!)} className="cursor-pointer hover:text-gray-200" key={item.id || Math.random()}>{item.name}</div>
              ))}
            </div>
            <hr className="border-0 border-t border-gray-600"></hr>
          </div>
        )}
      </div>
      <div>
        {
          tracks && tracks.items.map(item => (
            <div key={item.track.id}>
              {item.track.name}
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Stepper;
