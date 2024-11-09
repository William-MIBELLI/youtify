"use server";

import { SpotifyToken, UserData } from "@/src/interface/auth.interface";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { addLimitDate } from "../helpers/mapper";
import { updateCookie } from "../helpers/auth.helper";



export const loginWithSpotify = async () => {

  //ON RECUEPERE TOUS LES PARAMS POUR LA REQUEST
  const client_id = process.env.SPOTIFY_CLIENT_ID as string;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI as string;
  const scope = "user-read-private user-read-email playlist-modify-public";
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  const state = crypto.randomUUID();

  //ON STORE LE STATE DANS UN COOKIE
  const cookieStore = await cookies();
  cookieStore.set("spotify-state", state, {
    httpOnly: true,
    maxAge: 3600,
  });

  //ON GROUP LES PARAMS DANS UN OBJET
  const params = {
    response_type: "code",
    client_id,
    scope,
    redirect_uri,
    state,
  };

  //ON REDIRIGE VERS L'AUTHURL
  authUrl.search = new URLSearchParams(params).toString();
  redirect(authUrl.toString());
};

export const getTokensWithCode = async (code: string) => {
  const client_id = process.env.SPOTIFY_CLIENT_ID as string;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET as string;
  const encodedAuth = Buffer.from(`${client_id}:${client_secret}`).toString(
    "base64"
  );

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${encodedAuth}`,
      },
      body: new URLSearchParams({
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI as string,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      throw new Error(`Response error : ${response.statusText}`);
    }

    const token = (await response.json()) as Omit<SpotifyToken, 'limitDate'>;

    return token;
  } catch (error: any) {
    console.log("ERROR GET ACCESS TOKEN SPOTIFY : ", error?.message);
    return null;
  }
};

export const getSpotifySession = async (): Promise<UserData | undefined> => {
  try {
    //ON RECUEPERE LE TOKEN DANS COOKIE DE SESSION
    const sessionCookie = await cookies().get('spotify-session')?.value;

    //ON CHECK S'IL N'EST PAS UNDEFINED
    if (!sessionCookie) {
      throw new Error('No spotify-session cookie.');
    }

    //ON LE PARSE
    const tokens = JSON.parse(sessionCookie) as SpotifyToken

    //ON CHECK S'IL EST TOUJOURS VALIDE
    if (Date.now() >= tokens.limitDate) {

      //SI PAS VALIDE, ON LE REFRESH
      const newToken = await refreshSpotifyTokens();

      if (!newToken) {
        throw new Error('New token is null.');
      }
      tokens.access_token = newToken.access_token
    }

    //ON RECUPERE LES INFOS DE L'USER CONNECTE
    const response = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    })

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json() as {
      id: string;
      display_name: string;
      email: string;
      [key: string]: any;
    };

    //ON LES MAP POUR FIT USERDATA
    const userData: UserData = {
      id: data.id,
      email: data.email,
      name: data.display_name
    }

    //ON RETURN
    return userData

  } catch (error: any) {
    console.log("ERROR GET TOKENS FROM COOKIES : ", error?.message);
    return undefined;
  }
};

export const refreshSpotifyTokens = async (): Promise<SpotifyToken | null> => {

  try {
    //ON RECUPERE LE COOKIE
    const sessionCookie = await cookies().get('spotify-session')?.value;

    if (!sessionCookie) {
      throw new Error('no spotify cookie session.');
    }
    const tokens = JSON.parse(sessionCookie) as SpotifyToken;

    if (!tokens.refresh_token) {
      throw new Error('No refresh token on session');
    }
    const refresh_token = tokens.refresh_token;
    const client_id = process.env.SPOTIFY_CLIENT_ID as string;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET as string;

    //ON EN REQUEST UN NOUVEAU
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
        client_id,
        client_secret
      }),
    })

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    //ON RAJOUTE LA LIMITDATE
    const data = await response.json() as Omit<SpotifyToken, 'limitDate'>;
    const newToken = addLimitDate(data);

    //ON RAJOUTE LE REFRESH TOKEN SIL NEST PAS PRESENT DANS LE NOUVEAU
    if (!newToken.refresh_token) {
      newToken.refresh_token = tokens.refresh_token
    }

    //ON REMPLACE LE COOKIE
    await updateCookie(newToken, 'spotify');

    return newToken;
  } catch (error: any) {
    console.log('ERROR GET SPOTIFY REFRESH TOKEN : ', error?.message);
    return null;
  }
}


export const logoutWithSpotify = async () => {
  try {
    const spotifySession = await cookies().delete('spotify-session');
    return true;
  } catch (error: any) {
    console.log('ERROR LOGOUT SPOTIFY : ', error?.message);
    return null;
  }
}

export const getAllCookies = async (): Promise<void> => {
  try {
    const spotifyCookies = await cookies().getAll('spotify-session');
    const googleCookie = await cookies().getAll('google-session');

    console.log('SPOTIFIY COOKIE : ', spotifyCookies);
    console.log('GOOGLE COOKIES :', googleCookie);
  } catch (error: any) {
    console.log('ERROR GET ALL COKIES : ', error?.message);
  }
}