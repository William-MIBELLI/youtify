"use client";
import { authorize } from "@/src/lib/request/auth.request";
import { Button, Spinner } from "@nextui-org/react";
import React, { useState } from "react";
import Step from "./Step";
import SearchInput from "../input/SearchInput";
import { MessageCircleQuestion } from "lucide-react";
import { useFormState } from "react-dom";
import { signIn, signOut, useSession } from "next-auth/react";
import { IYoutubePlaylist } from "@/src/interface/youtube.interface";
import {
  getItemsFromPlaylist,
  getPlaylistWithAPI,
  getUserPlaylist,
  PlaylistItem,
  PlaylistsYT,
} from "@/src/lib/request/youtube.request";
import TrackSelector from "../trackSelector/TrackSelector";
import { mapYTPlaylist } from "@/src/lib/helpers/mapper";

const YoutubeStepper = () => {
  const [playlists, setPlaylists] = useState<IYoutubePlaylist>();
  const [videos, setVideos] = useState<PlaylistItem>();

  const onCLickHandler = async () => {
    await signIn("google");
  };

  const onGetMyPlaylistsClick = async () => {
    if (!session?.data?.accessToken) {
      return;
    }
    const data = await getUserPlaylist(session.data.accessToken);

    console.log('DATA : ', data);
    if (data) {
      setPlaylists(data);
    }
  };

  const onPlaylistClick = async (id: string) => {
    // const response = await fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=100&playlistId=${id}&key=AIzaSyDf6jU5jJIPlukKGrc9f4sNzfB_je6eTfI`, {
    //   method: 'GET',
    //   headers: {
    //     Authorization: `Bearer ${session?.data?.accessToken}`,
    //     Accept: "application/json",
    //   },
    // })
    // if (!response.ok) {
    //   console.log("reponse error : ", response.status);
    // }
    // const data = (await response.json());
    // console.log("DATA : ", data);
    if (!session?.data?.accessToken) {
      return;
    }
    const res = await getItemsFromPlaylist(session.data.accessToken, id);
    console.log("RES : ", res);
    if (res) {
      setVideos(res);
    }
  };

  const session = useSession();

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
        {session.status === "loading" ? (
          <Spinner />
        ) : session.status === "unauthenticated" ? (
          <Button onClick={onCLickHandler}>Login</Button>
        ) : (
          <div>
            <p>Logged as {session.data?.user?.email}</p>
            <Button onClick={onGetMyPlaylistsClick}>Get my playlists</Button>
            <Button onClick={() => signOut({ redirect: false })}>Logout</Button>
          </div>
        )}
      </Step>
      {playlists && (
        <Step index={2} title="Select a playlist">
          {playlists.items.map((item) => (
            <div onClick={() => onPlaylistClick(item.id)}>
              {item?.snippet?.title || "No title"}
            </div>
          ))}
        </Step>
      )}
      {videos && (
        <TrackSelector playlist={mapYTPlaylist(videos)}/>
      )}
    </div>
  );
};

export default YoutubeStepper;
