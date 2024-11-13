"use server";

import {
  IPlaylistTracksList,
  ISearchResult,
  ISpotifyRequestToken,
  IUserPlaylist,
  SpotifyTrack,
} from "@/src/interface/spotify.interface";
import { getCodeChallenge } from "../spotifyAuth/spotify.auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { URLSearchParams } from "url";
import { addLimitDate } from "../helpers/mapper";
import { SpotifyToken } from "@/src/interface/auth.interface";
import { getSpotifyAuthTokens, getSpotifySession } from "../auth/spotify.auth";

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
      throw new Error(response.statusText);
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

export const retrieveTrackOnSpotify = async (params: string) => {
  try {
    const token = await fetchSpotifyToken();
    const url = `${API_ENDPOINT}/search/?q=${params}&type=track&limit=1`;
    // console.log('URL : ', url);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const res = (await response.json()) as { tracks: ISearchResult };
    const track = res.tracks.items[0];

    return track;
  } catch (error: any) {
    console.log("ERROR RETRIEVE TRACKS ON SPOTIFY REQUEST : ", error?.message);
    return null;
  }
};

export const createPlaylistOnSpotify = async (
  userId: string,
  name: string,
  visibility: string
) => {
  try {
    //ON RECUPERE LE TOKEN D'AUTH
    const tokens = await getSpotifyAuthTokens();
    if (!tokens) {
      throw new Error("no tokens.");
    }

    const { access_token } = tokens;

    //ON REQUEST L'API
    const response = await fetch(`${API_ENDPOINT}/users/${userId}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        public: visibility === "public",
      }),
    });

    //ON CHECK SI LA REPONSE EST OK
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    //ON RECUEPERE L'ID 
    const data = (await response.json()) as {
      id: string;
      [key: string]: any;
    };
    console.log('DATA : ', data, data.id);
    //ON RETURN L'ID
    return data.id;
  } catch (error: any) {
    console.log("ERROR CREATE PLAYLSIT SPOTIFY REQUEST : ", error?.message);
    return null;
  }
};
