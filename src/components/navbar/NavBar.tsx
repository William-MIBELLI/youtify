"use client";
import { useSpotifyContext } from "@/src/context/SpotifySession.context";
import { usePlaylistStore } from "@/src/store/Playlist.store";
import { Spinner } from "@nextui-org/react";
import { p } from "framer-motion/client";
import { CircleCheckBig, CircleX, CloudDownload } from "lucide-react";
import { useSession } from "next-auth/react";
import { Yellowtail } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";

const titleFont = Yellowtail({
  weight: ["400"],
  subsets: ["latin"],
});

const NavBar = () => {
  const session = useSession();
  const spotifySession = useSpotifyContext();
  const playlist = usePlaylistStore(state => state.playlist);

  useEffect(() => {
    usePlaylistStore.persist.rehydrate();
  },[])

  console.log(session.data?.refreshToken)

  return (
    <nav className="w-full py-2 px-6 flex items-center justify-between mb-8">
      <Link href={"/"}>
        <h1
          className={`text-7xl my-2 w-fit text-gray-400 hover:text-gray-300 ${titleFont.className} `}
        >
          Youtify
        </h1>
      </Link>

      
      {/* PLAYLIST ON QUEUE */}
      <div>
        {
          playlist && (
            <Link href='/convert' className="flex items-center gap-1 text-red-300 text-sm hover:font-semibold">
              <p className="">
                You got 1 playlist on queue
              </p>
              <CloudDownload className="animate-bounce"/>
            </Link>
          )
        }
      </div>

      
      {/* CONNEXION STATUS */}
      <div className=" min-h-full flex items-center gap-4">
        {/* TITLE */}
        <p className="text-sm text-center font-semibold text-gray-200">
          Connexion status
        </p>

        {/* CONTAINER */}
        <div className="flex flex-col gap-2 justify-between text-xs text-gray-400">
          {/* SPOTIFY */}
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <Image
                src={"icons/spotify.svg"}
                alt="spotify_icon"
                width={15}
                height={15}
              />
              <p>Spotify</p>
            </div>
          </div>

          {/* YOUTUBE */}
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <Image
                src={"icons/youtube.svg"}
                alt="spotify_icon"
                width={15}
                height={15}
              />
              <p>Youtube</p>
            </div>
            <div className="flex items-center justify-center">
              {session.status === "authenticated" ? (
                <CircleCheckBig size={15} color="green" />
              ) : session.status === "loading" ? (
                <Spinner size="sm" color="white" />
              ) : (
                <CircleX size={15} color="red" />
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
