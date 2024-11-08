import AuthCompleteClient from "@/src/components/auth-complete/AuthCompleteClient";
import { SpotifyToken } from "@/src/interface/auth.interface";
import { getSpotifySession } from "@/src/lib/auth/spotify.auth";
import { cookies } from "next/headers";
import React, { FC } from "react";

interface IProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}
const page: FC<IProps> = async ({ searchParams }) => {

  const { state, code } = await searchParams;

  const serverState = await cookies().get('spotify-state');
  const serverCode = await cookies().get('spotify-code');

  if (!serverState || serverState.value !== state) {
    return <div>State error 🙃</div>;
  }

  if (!serverCode || serverCode.value !== code) {
    return <div>Code error 🙃</div>;
  }

  const data = await getSpotifySession();

  if (!data) {
    return <div>No tokens 🥲</div>;
  }

  return (
    <div>
      <AuthCompleteClient userData={data} provider="spotify" />
    </div>
  );
};

export default page;
