"use client";
import { Button, Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import Step from "./Step";
import SearchInput from "../input/SearchInput";
import { MessageCircleQuestion } from "lucide-react";
import { IYoutubePlaylist } from "@/src/interface/youtube.interface";
import {
  getItemsFromPlaylist,
  getPlaylistWithAPI,
  getUserPlaylist,
  PlaylistItem,
} from "@/src/lib/request/youtube.request";
import TrackSelector from "../trackSelector/TrackSelector";
import { mapYTPlaylist } from "@/src/lib/helpers/mapper";
import { loginWithGoogle } from "@/src/lib/auth/google.auth";
import { useSessionStore } from "@/src/store/Session.store";

const YoutubeStepper = () => {
  const [playlists, setPlaylists] = useState<IYoutubePlaylist>();
  const [videos, setVideos] = useState<PlaylistItem>();
  const googleStatus = useSessionStore(state => state.googleStatus);


  useEffect(() => {
    useSessionStore.persist.rehydrate();
  },[])

  const onCLickHandler = async () => {
    await loginWithGoogle();
  };

  const onGetMyPlaylistsClick = async () => {

    const data = await getUserPlaylist();
    console.log('DATA : ', data);
    if (data) {
      setPlaylists(data);
    }
  };

  const onPlaylistClick = async (id: string) => {

    const res = await getItemsFromPlaylist(id);
    console.log("RES : ", res);
    if (res) {
      setVideos(res);
    }
  };

  return (
    <div>
      <Step index={1} title="Search for a playlist by ID">
        <form action="">
          <SearchInput name="playlistId" />
          <div className="flex items-center gap-1 mt-3 ">
            <MessageCircleQuestion />
            <p className="text-sm font-semibold">
              You can also paste the playlist's share link
            </p>
          </div>
        </form>
        {
          googleStatus === 'Authenticated' && (
            <div className="w-full mt-4 flex items-center gap-3 text-emerald-400 font-semibold">
              <p>
                Or you can look for your personnals playlists :
              </p>
              <Button variant="bordered" className="text-gray-200" onClick={onGetMyPlaylistsClick}>Get my playlists</Button>
            </div>
          )
        }
      </Step>
      {(playlists && playlists.items.length > 0) && (
        <Step index={2} title="Select a playlist">
          {playlists.items.map((item) => (
            <div className={`cursor-pointer hover:font-semibold hover:text-gray-200`} key={item.id} onClick={() => onPlaylistClick(item.id)}>
              {item?.snippet?.title || "No title"}
            </div>
          ))}
        </Step>
      )}
      {videos && (
        <TrackSelector from="youtube" playlist={mapYTPlaylist(videos)}/>
      )}
    </div>
  );
};

export default YoutubeStepper;
