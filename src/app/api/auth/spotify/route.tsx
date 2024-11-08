import { getTokensWithCode } from "@/src/lib/auth/spotify.auth";
import { addLimitDate } from "@/src/lib/helpers/mapper";
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
  const cookieState = cookieStore.get("spotify-state");


  //ON CHECK SI IL Y A  UN CODE OU UNE ERROR
  if (!code || error) {
    return NextResponse.redirect(`/auth-error/${error}`);
  }

  //ON CHECK SI LE STATE EST CORRECT
  if (!state || !cookieState || state !== cookieState.value) {
    return NextResponse.redirect(`/auth-error/bad-state`);
  }

  //ON REQUEST LE ACCESS TOKEN
  const token = await getTokensWithCode(code);

  //ON CHECK SI LE TOKEN N'EST PAS NULL
  if (!token) {
    return NextResponse.redirect(new URL(`/auth-error/no-token`));
  }

  //ON AJOUTE UNE LIMITDATE
  const fullTokens = addLimitDate(token);


  //ON STOCKE LE FULLTOKENS DANS UN COOKIE
  cookies().set("spotify-session", JSON.stringify(fullTokens), {
    httpOnly: true,
  });


  //ON STOCKE EGALEMENT LE CODE POUR POUVOIR LE VERIFIER A LA RECUPERATION
  cookies().set("spotify-code", code, {
    httpOnly: true,
  });


  const url = new URL("/auth-confirm/spotify", request.url);
  url.searchParams.set("code", code);
  url.searchParams.set("state", state);
  return NextResponse.redirect(url);
}
