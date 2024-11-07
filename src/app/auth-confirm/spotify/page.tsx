import AuthCompleteClient from "@/src/components/auth-complete/AuthCompleteClient";
import { SpotifyToken } from "@/src/interface/spotify.interface";
import { getTokensFromCookies } from "@/src/lib/request/spotify.request";
import { cookies } from "next/headers";
import React, { FC } from "react";

interface IProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}
const page: FC<IProps> = async ({ searchParams }) => {
  const { state, code } = await searchParams;

  if (!state || !code) {
    return <div>Something goes wrong 🙃</div>;
  }

  const data = await getTokensFromCookies(code, state);

  if (!data) {
    return <div>No tokens 🥲</div>;
  }

  const limitDate = Date.now() + 3500 * 1000;
  const token: SpotifyToken = { ...data, limitDate };
  return (
    <div>
      <AuthCompleteClient token={token} />
    </div>
  );
};

export default page;
