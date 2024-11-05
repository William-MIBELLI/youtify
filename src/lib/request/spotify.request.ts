"use server";

import {
  IPlaylistTracksList,
  ISearchResult,
  ISpotifyRequestToken,
  IUserPlaylist,
  SpotifyToken,
  SpotifyTrack,
} from "@/src/interface/spotify.interface";
import { getCodeChallenge } from "../spotifyAuth/spotify.auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { URLSearchParams } from "url";
import { addLimitDate } from "../helpers/mapper";

const API_ENDPOINT = "https://api.spotify.com/v1";

export const fetchSpotifyToken = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  try {
    //ON CHECK SI ON A LES VARIABLES D'ENVIRONNEMENT
    if (!clientId || !clientSecret) {
      throw new Error("Env id or secret miss");
    }

    //ON REQUEST
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    //ON CHECK SI LA RESPONSE EST OK
    if (!response.ok) {
      throw new Error(`Response error, status : ${response.status}`);
    }

    //ON REDCUPERE LE TOKEN
    const data = (await response.json()) as ISpotifyRequestToken;

    //ET ON LE RETURN
    return data;
  } catch (error: any) {
    console.log("ERROR GET SPOTIFY TOKEN : ", error?.message);
    return null;
  }
};

export const getSpotifyUserPlaylists = async (
  userId: string,
  token: string
) => {
  try {
    //ON REQUEST
    const response = await fetch(`${API_ENDPOINT}/users/${userId}/playlists`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    //ON CHECK SI LA RESPONSE EST OK
    if (!response.ok) {
      throw new Error(`Response error, status : ${response.status}`);
    }

    //ON PARSE
    const data = (await response.json()) as IUserPlaylist;

    //ON MAP POUR IGNORER LES PLAYLISTS SANS TRACKS
    const mappedItems = data.items.filter((item) =>
      item?.tracks?.total ? item.tracks?.total > 0 : null
    );

    const mappedData: IUserPlaylist = { ...data, items: mappedItems };

    return mappedData;
  } catch (error: any) {
    console.log("ERROR GET USER PLAYLIST SPOTIFY : ", error?.message);
    return null;
  }
};

export const getPlaylistTracks = async (playlistId: string) => {
  try {
    //ON FETCH UN TOKEN
    const token = await fetchSpotifyToken();

    if (!token) {
      throw new Error("Invalid token.");
    }

    //ON REQUEST
    const response = await fetch(
      `${API_ENDPOINT}/playlists/${playlistId}/tracks?market=FR`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Response error, status : ${response.status}`);
    }

    //ON PARSE
    const data = (await response.json()) as IPlaylistTracksList;

    //ON FILTRE POUR EVITER LES TRACKS SANS NAME OU SANS ARTISTE
    const filteredItems = data.items.filter((item) => {
      if (
        item.track?.name !== null &&
        item.track?.name !== undefined &&
        item.track?.artists[0]?.name !== null &&
        item.track?.artists[0]?.name !== undefined
      ) {
        return item;
      }
    });
    const mappedData: IPlaylistTracksList = { ...data, items: filteredItems };
    return mappedData;
  } catch (error: any) {
    console.log("ERROR GET PLYALIST TRACKS : ", error?.message);
    return null;
  }
};

export const authInSpotify = async () => {
  const client_id = process.env.SPOTIFY_CLIENT_ID as string;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI as string;
  const scope = "user-read-private user-read-email playlist-modify-public";
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  // const code_challenge = await getCodeChallenge();
  const state = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set("state", state, {
    httpOnly: true,
    maxAge: 3600,
  });
  const params = {
    response_type: "code",
    client_id,
    scope,
    redirect_uri,
    state,
  };

  authUrl.search = new URLSearchParams(params).toString();
  redirect(authUrl.toString());
};

export const getTokensFromSpotifyAPI = async (code: string) => {
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

export const getTokensFromCookies = async (code: string, state: string) => {
  try {
    // Récupération des cookies - pas besoin de await car cookies() n'est pas async
    const cookieStore = await cookies();
    const temp_code = cookieStore.get("temp_code")?.value;
    const temp_state = cookieStore.get("temp_state")?.value;
    const temp_token = cookieStore.get("temp_token")?.value;

    //ON CHECK SI LE CODE ET LE STATE EST BON
    if (code !== temp_code || state !== temp_state) {
      console.log(code, temp_code, state, temp_state);
      throw new Error("validation error. code or state not match.");
    }

    //ON CLEAN LES COOKIES - pas besoin de await
    //  cookieStore.set('temp_code', '');
    //  cookieStore.set('temp_state', '');
    //  cookieStore.set('temp_access_token', '');
    //  cookieStore.set('temp_refresh_token', '');
    return JSON.parse(temp_token || "") as Omit<SpotifyToken, 'limitDate'>;
  } catch (error: any) {
    console.log("ERROR GET TOKENS FROM COOKIES : ", error?.message);
    return null;
  }
};

export const retrieveTrackOnSpotify = async (params: string) => {
  try {

    const token = await fetchSpotifyToken();
    const url = `${API_ENDPOINT}/search/?q=${params}&type=track&limit=1`;
    // console.log('URL : ', url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token?.access_token}`
      }
    })
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const res = await response.json() as {tracks: ISearchResult};
    const track = res.tracks.items[0];

    return track;
  } catch (error: any) {
    console.log('ERROR RETRIEVE TRACKS ON SPOTIFY REQUEST : ', error?.message);
    return null;
  }
};

export const refreshSpotifyTokens = async (refresh_token: string) => {
  try {
    const client_id = process.env.SPOTIFY_CLIENT_ID as string;
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
        client_id
      }),
    })
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json() as Omit<SpotifyToken, 'limitDate'>;
    const token = addLimitDate(data);
    return token;
  } catch (error: any) {
    console.log('ERROR GET REFRESH TOKEN : ', error?.message);
    return null;
  }
}
