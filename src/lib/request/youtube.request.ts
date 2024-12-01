"use server";

import { IYoutubePlaylist } from "@/src/interface/youtube.interface";
import { google, GoogleApis } from "googleapis";
import { getGoogleAccessToken } from "../auth/google.auth";
import Schema$PlaylistItem from "googleapis";
import { Playlist, TrackToConvert } from "@/src/store/Playlist.store";
import Youtube, { Video, youtube } from "scrape-youtube";
import { getOauthClient } from "../helpers/auth.helper";

const YOUTUBE_API_ENDPOINT = "https://youtube.googleapis.com/youtube/v3";

export const getUserPlaylist = async () => {
  try {
    const { YOUTUBE_API_KEY } = process.env;

    if (!YOUTUBE_API_KEY) {
      throw new Error("API Key missing");
    }

    const accessToken = await getGoogleAccessToken();

    if (!accessToken) {
      throw new Error("No access token.");
    }

    const response = await fetch(
      `${YOUTUBE_API_ENDPOINT}/playlists?part=snippet%2CcontentDetails%2Cstatus&maxResults=25&mine=true&key=${YOUTUBE_API_KEY}`,
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
      throw new Error(response.statusText);
    }
    const data = (await response.json()) as IYoutubePlaylist;

    return data;
  } catch (error: any) {
    console.log("ERROR FETCH USER PLAYLIST : ", error?.message);
    return null;
  }
};

export type PlaylistsYT = Awaited<ReturnType<typeof getPlaylistWithAPI>>;

export const getPlaylistWithAPI = async (playlistId: string) => {
  try {
    // const access_token = await getGoogleAccessToken();

    // if (!access_token) {
    //   throw new Error('No access token.');
    // }
    const youtube = google.youtube({ version: "v3" });
    const response = await youtube.playlists.list({
      // access_token,
      part: ["snippet", "status"],
      id: [playlistId],
      key: process.env.YOUTUBE_API_KEY as string,
    });

    if (response.status !== 200) {
      throw new Error("Response error, status : " + response.status);
    }

    const playlist = response.data;
    return playlist;
  } catch (error: any) {
    console.log("ERROR GET PLAYLIST WITH API : ", error?.message);
    return null;
  }
};

export const getItemsFromPlaylist = async (
  playlistId: string,
  status?: string
) => {
  try {
    const { YOUTUBE_API_KEY } = process.env;

    if (!YOUTUBE_API_KEY) {
      throw new Error("API Key missing");
    }

    console.log("status : ", status);
    const access_token = await getGoogleAccessToken();

    if (!access_token && status && status === "private") {
      throw new Error(
        "The playlist visibility is PRIVATE, and no access token found."
      );
    }

    const youtube = google.youtube({ version: "v3" });
    const response = await youtube.playlistItems.list({
      key: YOUTUBE_API_KEY,
      part: ["snippet"],
      playlistId,
      maxResults: 100,
      access_token: access_token || undefined,
    });

    if (response.status !== 200) {
      throw new Error(response.statusText);
    }

    if (!response.data.items) {
      throw new Error("No items for this playlist.");
    }
    const itemsData = response.data.items;

    return itemsData;
  } catch (error: any) {
    console.log("ERROR GET VIDEO FROM PLAYLIST : ", error?.message);
    return [];
  }
};

export type PlaylistItem = Awaited<ReturnType<typeof getItemsFromPlaylist>>;
export type YTItem = PlaylistItem[number];

export const scrapVideoOnYoutube = async (playlist: string[]) => {
  try {
    //ON FAIT UN PROMISE ALL POUR LOOP SUR LA PLAYLIST EN ARGUMENT
    const vids = await Promise.all(
      playlist.map(async (track) => {
        //ON REQUEST LE SCRAPPER
        const res = await youtube.search(track, {
          type: "video",
        });

        //ON MAP LE RESULT VERS UN TYPE PLAYLIST POUR FIT LE STORE
        const mapped: Playlist = res.videos.map((item) => {
          const mp: TrackToConvert = {
            id: item.id,
            title: item.title,
            artist: item.channel.name,
          };
          return mp;
        });
        return mapped;
      })
    );

    //ON RETURN LE PROMISE ALL
    return vids;
  } catch (error: any) {
    console.log("ERROR SCRAP VIDEOS YOUTUBE REQUEST : ", error?.message);
    return null;
  }
};

export const createPlaylistOnYoutube = async (
  title: string,
  status: string
): Promise<string> => {
  const accessToken = await getGoogleAccessToken();
  const res = await google.youtube("v3").playlists.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title,
      },
      status: {
        privacyStatus: status,
      },
    },
    auth: process.env.GOOGLE_API_KEY as string,
    access_token: accessToken!,
  });

  if (res.status !== 200 || !res.data.id) {
    throw new Error(`GOOGLE CREATE PLAYLIST REQUEST ERROR : ${res.statusText}`);
  }

  console.log("PLAYLIST ID CREATION : ", res.data.id);
  return res.data.id;
};

export const insertVideoOnPLaylistYoutube = async (
  playlsitId: string,
  list: string[]
) => {
  const accessToken = await getGoogleAccessToken();
  const auth = process.env.GOOGLE_API_KEY as string;
  // const videoId = list[0];
  try {
    await Promise.all(
      list.map(async (videoId) => {
        console.log('BIP ', videoId)
        const res = await google.youtube("v3").playlistItems.insert({
          auth,
          access_token: accessToken!,
          part: ["snippet"],
          requestBody: {
            snippet: {
              resourceId: {
                videoId,
                kind: "youtube#video",
              },
              playlistId: playlsitId,
            },
          },
        });
        if (res.status !== 200) {
          throw new Error(
            `GOOGLE INSERT ITEMS ON PLAYLIST ERROR : ${res.statusText}`
          );
        }
      })
    );
    return true;
    
  } catch (error: any) {
    console.log(error?.message);
    return false
  }

};
