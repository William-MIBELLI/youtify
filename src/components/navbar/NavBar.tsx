"use client";

import { usePlaylistStore } from "@/src/store/Playlist.store";
import {  CloudDownload } from "lucide-react";
import { Yellowtail } from "next/font/google";
import Link from "next/link";
import React, { useEffect } from "react";
import AuthDisplayer from "../auth-displayer/AuthDisplayer";

const titleFont = Yellowtail({
  weight: ["400"],
  subsets: ["latin"],
});

const NavBar = () => {
  const playlist = usePlaylistStore((state) => state.playlist);

  //ON REHYDRATE LES STORES
  useEffect(() => {
    usePlaylistStore.persist.rehydrate();
  }, []);

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
        {playlist && (
          <Link
            href="/convert"
            className="flex items-center gap-1 text-red-300 text-sm hover:font-semibold"
          >
            <p className="">You got 1 playlist on queue</p>
            <CloudDownload className="animate-bounce" />
          </Link>
        )}
      </div>

      {/* AUTHENTICATION STATUS */}
      <AuthDisplayer />
    </nav>
  );
};

export default NavBar;
