"use client";
import { usePlaylistStore } from "@/src/store/Playlist.store";
import { ExternalLink } from "lucide-react";
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
    <Link href={link} target="blank" className="flex items-center gap-1">
      <p>You can access it</p>
      <p className=" flex items-center gap-1 font-semibold underline cursor-pointer hover:text-gray-200">
        here
        <ExternalLink size={18}/>
      </p>
    </Link>
  );
};

export default SuccessLink;
