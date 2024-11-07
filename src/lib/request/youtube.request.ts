'use server';

import { IYoutubePlaylist } from "@/src/interface/youtube.interface";
import { access } from "fs";
import { youtube_v3, google } from 'googleapis'
import { getOauthClient } from "../helpers/auth.helper";

const YOUTUBE_API_ENDPOINT = 'https://youtube.googleapis.com/youtube/v3'

export const getUserPlaylist = async (accessToken: string) => {

  try {
    const { YOUTUBE_API_KEY } = process.env;

    if (!YOUTUBE_API_KEY) {
      throw new Error('API Key missing');
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
      throw new Error('Response statuts : ' + response.statusText)
    }
    const data = (await response.json()) as IYoutubePlaylist;
    
    return data;
  } catch (error: any) {
    console.log('ERROR FETCH USER PLAYLIST : ', error?.message);
    return null;
  }
}

export type PlaylistsYT = Awaited<ReturnType<typeof getPlaylistWithAPI>>

export const getPlaylistWithAPI = async (access_token: string) => {
  try {
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

export const getItemsFromPlaylist = async (access_token: string, playlistId: string) => {
  try {
    const { YOUTUBE_API_KEY } = process.env;

    if (!YOUTUBE_API_KEY) {
      throw new Error('API Key missing');
    }

    const youtube = google.youtube({ version: 'v3' });
    const response = await youtube.playlistItems.list({
      access_token,
      key: YOUTUBE_API_KEY,
      part: ['snippet'],
      playlistId,
      maxResults: 100
    })

    if (response.status !== 200) {
      throw new Error(`Error response : ${response.statusText}`);
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
