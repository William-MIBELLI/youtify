"use client";
import { Button, Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import Step from "./Step";
import SearchInput from "../input/SearchInput";
import { MessageCircleQuestion } from "lucide-react";
import { IYoutubePlaylist } from "@/src/interface/youtube.interface";
import {
  getItemsFromPlaylist,
  getUserPlaylist,
  PlaylistItem,
} from "@/src/lib/request/youtube.request";
import TrackSelector from "../trackSelector/TrackSelector";
import { mapYTPlaylist } from "@/src/lib/helpers/mapper";
import { loginWithGoogle } from "@/src/lib/auth/google.auth";
import { useSessionStore } from "@/src/store/Session.store";
import { useFormState } from "react-dom";
import { searchYoutubePlaylistACTION } from "@/src/lib/action/youtube.action";
import type { youtube_v3 } from "googleapis";

const YoutubeStepper = () => {
  const [playlists, setPlaylists] = useState<
    IYoutubePlaylist | youtube_v3.Schema$PlaylistListResponse
  >();
  const [videos, setVideos] = useState<PlaylistItem>();
  const googleStatus = useSessionStore((state) => state.googleStatus);

  useEffect(() => {
    useSessionStore.persist.rehydrate();
  }, []);

  const onSubmitHandler = () => {
    setPlaylists(undefined);
    setVideos(undefined);
  }

  const onGetMyPlaylistsClick = async () => {
    const data = await getUserPlaylist();
    if (data) {
      setPlaylists(data);
    }
  };

  const onPlaylistClick = async (id: string, status?:string) => {
    const res = await getItemsFromPlaylist(id);
    if (res) {
      setVideos(res);
    }
  };



  const [state, action] = useFormState(searchYoutubePlaylistACTION, undefined);

  useEffect(() => {
    if (state && state?.success && state?.playlist) {
      setPlaylists(state.playlist);
      return;
    }
  }, [state]);

  return (
    <div>

      {/* SEARCH PLAYLIST */}
      <Step index={1} title="Search for a playlist by ID">
        <p>PLaRBrAGRX_7REZK2HWewRjzQGDlxsnt3S</p>
        <form action={action} onSubmit={onSubmitHandler}>
          <SearchInput name="playlistId" error={state?.error} />
          <div className="flex items-center gap-1 mt-3 ">
            <MessageCircleQuestion />
            <p className="text-sm font-semibold">
              You can also paste the playlist's share link
            </p>
          </div>
        </form>
        {googleStatus === "Authenticated" && (
          <div className="w-full mt-4 flex items-center gap-3 text-emerald-400 font-semibold">
            <p>Or you can look for your personnals playlists :</p>
            <Button
              variant="bordered"
              className="text-gray-200"
              onClick={onGetMyPlaylistsClick}
            >
              Get my playlists
            </Button>
          </div>
        )}
      </Step>

      {/* PLAYLISTS LIST */}
      {playlists && playlists.items && playlists.items.length > 0 && (
        <Step index={2} title="Select a playlist">
            <div className="w-fill grid grid-cols-2 text-gray-200">
              <p className="text-emerald-600">
                Name
              </p>
              <p className="text-emerald-600">
                Visibility
              </p>
              <div className="col-span-2 divider mb-3"/>

          {playlists.items.map((item) => (
              <div
                className={`grid grid-cols-2 col-span-2 cursor-pointer hover:font-semibold hover:text-gray-200`}
                key={item.id}
                onClick={() => onPlaylistClick(item.id!, item.status?.privacyStatus || undefined)}
              >
                <p>
                  {item?.snippet?.title || "No title"}
                </p>
                <p>
                  {item.status?.privacyStatus}
                </p>
              </div>
          ))}
          </div>
        </Step>
      )}

      {/* TRACKS LIST */}
      {videos && (
        <TrackSelector from="youtube" playlist={mapYTPlaylist(videos)} />
      )}
    </div>
  );
};

export default YoutubeStepper;
