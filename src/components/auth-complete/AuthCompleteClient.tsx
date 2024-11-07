"use client";
import { useSpotifyContext } from "@/src/context/SpotifySession.context";
import {
  AuthenticationStatus,
  GoogleUserData,
} from "@/src/interface/auth.interface";
import { SpotifyToken } from "@/src/interface/spotify.interface";
import { useSessionStore } from "@/src/store/Session.store";
import { useRouter } from "next/navigation";
import React, { FC, useEffect } from "react";

interface IProps {
  token?: SpotifyToken;
  userData?: {
    status: AuthenticationStatus;
    data: GoogleUserData | null;
  };
}

const AuthCompleteClient: FC<IProps> = ({ token, userData }) => {
  
  const { setToken } = useSpotifyContext();
  const setGoogle = useSessionStore((state) => state.setGoogle);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      setToken(token);
    }

    if (userData) {
      setGoogle(userData.data || undefined, userData.status);
    }
    router.push("/");
  }, [token, userData]);

  return <div>AuthCompleteClient</div>;
};

export default AuthCompleteClient;
