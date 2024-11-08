"use client";
import { AuthenticationStatus, UserData } from "@/src/interface/auth.interface";
import { useSessionStore } from "@/src/store/Session.store";
import React, { FC, useEffect } from "react";

interface IProps {
  googleData: UserData | undefined;
  spotifyData: UserData | undefined;
}

const SessionInitializer: FC<IProps> = ({ googleData, spotifyData }) => {
  const setGoogle = useSessionStore((state) => state.setGoogle);
  const setSpotify = useSessionStore((state) => state.setSpotify);
  const google = useSessionStore((state) => state.googleData);

  //ON REHYDRATE AU MONTAGE
  useEffect(() => {
    useSessionStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    setGoogle(googleData);
    setSpotify(spotifyData);
  }, [googleData, setGoogle, spotifyData]);

  return null;
};

export default SessionInitializer;
