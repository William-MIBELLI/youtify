"use client";

import { createContext, useContext, useState } from "react";
import { SpotifyTrack } from "../interface/spotify.interface";
import { IYoutubePlaylist } from "../interface/youtube.interface";

 const usePlayListContextValue = () => {

  const [spotifyPlaylist, setSpotifyPlaylist] = useState<SpotifyTrack[]>();
  const [youtubePlaylist, setYoutubePlaylist] = useState<IYoutubePlaylist>();

  return {
    spotifyPlaylist,
    setSpotifyPlaylist,
    youtubePlaylist,
    setYoutubePlaylist,
  };
};

type ContextType = ReturnType<typeof usePlayListContextValue>;

const PlaylistContext = createContext<ContextType>({} as ContextType);

export const PlaylistContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const value = usePlayListContextValue();
  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylistContext = () => useContext(PlaylistContext);
