"use client";
import { AuthenticationStatus, UserData } from "@/src/interface/auth.interface";
import { useSessionStore } from "@/src/store/Session.store";
import { useRouter } from "next/navigation";
import React, { FC, useEffect } from "react";

interface IProps {
  userData: UserData | null;
  provider: 'google' | 'spotify'
}

const AuthCompleteClient: FC<IProps> = ({ userData, provider }) => {
  const setGoogle = useSessionStore((state) => state.setGoogle);
  const setSpotify = useSessionStore((state) => state.setSpotify);
  const router = useRouter();

  useEffect(() => {
    if (provider === 'google') {
      setGoogle(userData || undefined);
    } else {
      setSpotify(userData || undefined)
    }
    router.push("/");
  }, [userData, provider]);

  return <div>AuthCompleteClient</div>;
};

export default AuthCompleteClient;
