"use client";
import { usePlaylistStore } from "@/src/store/Playlist.store";
import Link from "next/link";
import React, { useEffect } from "react";

const SuccessLink = () => {

  const link = usePlaylistStore(state => state.createdPlaylistLink)

  useEffect(() => {
    usePlaylistStore.persist.rehydrate();
  }, [])
  
  if (!link) {
    return null;
  }

  return (
    <Link href={link} className="flex items-center gap-1">
      <p>You can access it</p>
      <p className="font-semibold underline cursor-pointer hover:text-gray-200">
        here
      </p>
    </Link>
  );
};

export default SuccessLink;
