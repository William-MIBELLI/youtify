'use server';

import { IYoutubePlaylist } from "@/src/interface/youtube.interface";
import { access } from "fs";
import { youtube_v3, google } from 'googleapis'
import { getOauthClient } from "../helpers/auth.helper";
import { cookies } from "next/headers";
import { GoogleSessionToken } from "@/src/interface/auth.interface";
import { getGoogleAccessToken } from "../auth/google.auth";

const YOUTUBE_API_ENDPOINT = 'https://youtube.googleapis.com/youtube/v3'

export const getUserPlaylist = async () => {

  try {
    const { YOUTUBE_API_KEY } = process.env;

    if (!YOUTUBE_API_KEY) {
      throw new Error('API Key missing');
    }

    // const googleCookie = await cookies().get('google-session')?.value;

    // if (!googleCookie) {
    //   throw new Error('No google session.');
    // }

    // const tokens = JSON.parse(googleCookie) as GoogleSessionToken;
    const accessToken = await getGoogleAccessToken();

    if (!accessToken) {
      throw new Error('No access token.');
    }

    const response = await fetch(
      `${YOUTUBE_API_ENDPOINT}/playlists?part=snippet%2CcontentDetails&maxResults=25&mine=true&key=${YOUTUBE_API_KEY}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );
    if (!response.ok) {
      console.log(response);
      throw new Error(response.statusText)
    }
    const data = (await response.json()) as IYoutubePlaylist;
    
    return data;
  } catch (error: any) {
    console.log('ERROR FETCH USER PLAYLIST : ', error?.message);
    return null;
  }
}

export type PlaylistsYT = Awaited<ReturnType<typeof getPlaylistWithAPI>>

export const getPlaylistWithAPI = async () => {
  try {
    const access_token = await getGoogleAccessToken();

    if (!access_token) {
      throw new Error('No access token.');
    }
    const youtube = google.youtube({ version: 'v3' });
    const response = await youtube.playlists.list({
      access_token,
      part: ['snippet'],
      mine: true,
      maxResults: 100
    })
    
    if (response.status !== 200) {
      throw new Error('Response error, status : ' + response.status);
    }

    const playlist = response.data;
    return playlist;
  } catch (error:any) {
    console.log('ERROR GET PLAYLIST WITH API : ', error?.message);
    return null;
  }
}

export const getItemsFromPlaylist = async (playlistId: string) => {
  try {
    const { YOUTUBE_API_KEY } = process.env;

    if (!YOUTUBE_API_KEY) {
      throw new Error('API Key missing');
    }

    const access_token = await getGoogleAccessToken();
    
    if (!access_token) {
      throw new Error('No access token.');
    }

    const youtube = google.youtube({ version: 'v3' });
    const response = await youtube.playlistItems.list({
      key: YOUTUBE_API_KEY,
      part: ['snippet'],
      playlistId,
      maxResults: 100,
      access_token
    })

    if (response.status !== 200) {
      throw new Error(response.statusText);
    }

    if (!response.data.items) {
      throw new Error('No items for this playlist.');
    }
    const itemsData = response.data.items;

    return itemsData;

  } catch (error: any) {
    console.log('ERROR GET VIDEO FROM PLAYLIST : ', error?.message);
    return [];
  }
}

export type PlaylistItem = Awaited<ReturnType<typeof getItemsFromPlaylist>>;
export type YTItem = PlaylistItem[number];


export const getPlaylistFromUser = async () => {
  try {
    const client = getOauthClient();
    const res = await client
  } catch (error: any) {
    console.log('ERROR GET PLAYLIST WITH OAUTHCLIENT : ', error?.message);
    return null;
  }
}
