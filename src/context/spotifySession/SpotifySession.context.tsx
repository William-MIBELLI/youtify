'use client'
import { SpotifyToken } from "@/src/interface/spotify.interface";
import { createContext, FC, useContext, useState } from "react";

interface IProps {
  children: React.ReactNode;
}

const useSpotifyContextValue = () => {
  const [token, setToken] = useState<SpotifyToken>();
  return {
    token,
    setToken,
  };
};

const SpotifySessionContext = createContext<
  ReturnType<typeof useSpotifyContextValue>
>({} as 
  ReturnType<typeof useSpotifyContextValue>);

export const SpotifyProvider: FC<IProps> = ({ children }) => {
  const value = useSpotifyContextValue();
  return (
    <SpotifySessionContext.Provider value={value}>
      {children}
    </SpotifySessionContext.Provider>
  );
};

export const useSpotifyContext = () => useContext(SpotifySessionContext);
