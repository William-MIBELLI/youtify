"use server";

import { getPlaylistWithAPI } from "../request/youtube.request";


// PLaRBrAGRX_7REZK2HWewRjzQGDlxsnt3S

export const searchYoutubePlaylistACTION = async (
  state: unknown,
  fd: FormData
) => {
  try {
    const playlistId = fd.get('playlistId')?.toString();
    if (!playlistId) {
      throw new Error('No playlistId or URL in input.');
    }

    const playlist = await getPlaylistWithAPI(playlistId);

    if (!playlist || !playlist.items || playlist?.items?.length === 0) {
      throw new Error('No playlist with this id. Be sure its a public one.');
    }

    return { success: true, playlist: playlist };
  } catch (error: any) {
    console.log("ERROR SEARCH YOUTUBE PLAYLIST ACTION : ", error?.message);
    return {
      success: false,
      error: error?.message || "Something wents wrong.",
    };
  }
};
