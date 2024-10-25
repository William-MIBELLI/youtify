"use client";
import React from "react";
import Image from "next/image";
import {
  getSpotifyToken,
  getUserPlaylists,
} from "@/src/lib/request/spotify.request";
import Link from "next/link";

const OriginSelector = () => {
  const onCLickHandler = async () => {
    const data = await getSpotifyToken();
    console.log("CLICK : ", data);
  };

  const onGetUserPlaylist = async () => {
    const tokenData = await getSpotifyToken();
    if (!tokenData) {
      return;
    }
    const data = await getUserPlaylists("aspirin11", tokenData.access_token);
    console.log("DATA : ", data);
  };

  return (
    <div className="border border-gray-900 flex w-1/2 h-96  rounded-xl overflow-x-hidden justify-center relative">
      <Link
        href={"/from-spotify"}
        className="bg-gray-950 absolute h-full left-0 w-[55%] left selector"

      >
        <div className=" flex gap-1 items-center">
          <h2 className="font-semibold text-2xl">From Spotify</h2>
          <Image
            src="/icons/spotify.svg"
            alt="spotify icon"
            width={40}
            height={40}
          />
        </div>
      </Link>
      <Link
        href={'/from-youtube'}
        className="bg-gray-900 absolute h-full left-[45%] w-[55%] right selector hover:left-0 text-gray-400"
      >
        <div className="flex gap-1 items-center">
          <h2 className="font-semibold text-2xl">From Youtube</h2>
          <Image
            src={"/icons/youtube.svg"}
            alt="youtube icon"
            width={40}
            height={40}
          />
        </div>
      </Link>
    </div>
  );
};

export default OriginSelector;
