"use client";
import {
  AuthenticationStatus,
  AuthProvider,
  UserData,
} from "@/src/interface/auth.interface";
import React, { FC } from "react";
import Image from "next/image";
import { Button, Divider, Spinner } from "@nextui-org/react";
import { CircleCheckBig, CircleX, LogIn, LogOut } from "lucide-react";
import { div } from "framer-motion/client";
import {
  deleteGoogleSession,
  loginWithGoogle,
} from "@/src/lib/auth/google.auth";
import { loginWithSpotify, logoutWithSpotify } from "@/src/lib/auth/spotify.auth";

interface IProps {
  status: AuthenticationStatus;
  provider: AuthProvider;
}

const AuthDetails: FC<IProps> = ({ status, provider }) => {
  const onLoginClick = async () => {
    if (provider === "google") {
      await loginWithGoogle();
      return;
    }
    await loginWithSpotify();
  };

  const onLogoutCLick = async () => {
    if (provider === "google") {
      await deleteGoogleSession();
      return;
    }
    await logoutWithSpotify();
  };

  return (
    <div className=" min-h-full justify-center flex flex-col gap-1  text-gray-300">
      <div className="flex gap-3 items-center">
        {/* TITLE */}
        {provider === "spotify" ? (
          <div className="flex items-center gap-1">
            <Image
              src={"/icons/spotify.svg"}
              alt="spotify_icon"
              width={15}
              height={15}
            />
            <p>Spotify</p>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Image
              src={"/icons/youtube.svg"}
              alt="spotify_icon"
              width={15}
              height={15}
            />
            <p>Youtube</p>
          </div>
        )}

        {/* STATUS */}
        <div className="flex items-center justify-center">
          {status === "Authenticated" ? (
            <CircleCheckBig size={15} color="green" />
          ) : status === "Loading" ? (
            <Spinner size="sm" color="white" />
          ) : (
            <CircleX size={15} color="red" />
          )}
        </div>
      </div>
      <Divider className="bg-gray-600 mb-3" />

      {/* BUTTON */}
      <div className="flex items-center justify-center">
        {status === "Authenticated" ? (
          <div
            onClick={onLogoutCLick}
            className="flex cursor-pointer hover:text-gray-200 items-center text-gray-400 gap-1"
          >
            <p className="text-xs font-thin">Log out</p>
            <LogOut size={13} />
          </div>
        ) : status === "Unauthenticated" ? (
          <div
            onClick={onLoginClick}
            className="flex cursor-pointer hover:text-gray-200 items-center text-gray-400 gap-1"
          >
            <p className="text-xs font-thin">Log in</p>
            <LogIn size={13} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AuthDetails;
