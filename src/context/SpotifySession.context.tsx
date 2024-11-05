'use client'
import { SpotifyToken } from "@/src/interface/spotify.interface";
import { createContext, FC, useContext, useState } from "react";
import { refreshSpotifyTokens } from "../lib/request/spotify.request";

interface IProps {
  children: React.ReactNode;
}

const useSpotifyContextValue = () => {
  const [token, setToken] = useState<SpotifyToken>();

  const isConnected = async () => {

    console.log('TOKEN : ', token);
    //ON CHECK SI IL Y A UN TOKEN
    if (!token) return false
    
    const now = Date.now();

    //ON CHECK LA VALIDATE DU TOKEN
    if (now < token.limitDate) {
     
      //SI IL EST PERIME, ON EN REQUEST UN NOUVEAU AVEC LE REFRESH_TOKEN
      const newToken = await refreshSpotifyTokens(token.refresh_token);

      //SI LA REQUEST EST SUCCES, ON REMPLACE LE TOKEN DANS LE CONTEXT ET ON RETURN TRUE
      if (newToken) {
        setToken(newToken);
        return true;
      }

      //SINON DELETE LE TOKEN DU CONTEXT ET RETURN FALSE
      setToken(undefined);
      return false;
    }

    return true
  }

  return {
    token,
    setToken,
    isConnected
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
