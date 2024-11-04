import { getTokensFromSpotifyAPI } from "@/src/lib/request/spotify.request";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  //ON RECUEPERE LES QUERIES
  const { searchParams } = new URL(request.url);

  const cookieStore = await cookies();
  //ON LES DESTRUCTURE
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");
  const cookieState = cookieStore.get("state");


  //ON CHECK SI IL Y A  UN CODE OU UNE ERROR
  if (!code || error) {
    return NextResponse.redirect(`/auth-error/${error}`);
  }

  if (!state || !cookieState || state !== cookieState.value) {
    return NextResponse.redirect(`/auth-error/bad-state`);
  }

  //ON REQUEST LE ACCESS TOKEN
  const token = await getTokensFromSpotifyAPI(code);

  //ON CHECK SI LE TOKEN N'EST PAS NULL
  if (!token) {
    return NextResponse.redirect(new URL(`/auth-error/no-token`));
  }

  cookies().set("temp_token", JSON.stringify(token), {
    httpOnly: true,
  });

  cookies().set("temp_state", state, {
    httpOnly: true,
  });

  cookies().set("temp_code", code, {
    httpOnly: true,
  });

  // console.log("TOKEN : ", token);

  const url = new URL("/auth-confirm", request.url);
  url.searchParams.set("code", code);
  url.searchParams.set("state", state);
  return NextResponse.redirect(url);
}
