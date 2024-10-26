'use server';

import { ISpotifyToken } from "@/src/interface/spotify.interface";
import { fetchSpotifyToken, getSpotifyUserPlaylists } from "../request/spotify.request";

export const searchSpotifyUserPlaylistACTION = async (state: unknown, fd: FormData) => {
  try {

    //ON RECUPERE LE USERID DANS LE FORMDATA
    const userId = fd.get('userId')?.toString();

    if (!userId) {
      throw new Error('user id is required.');
    }

    //ON RECUPERE LE USER

    //ON FETCH UN TOKEN
    const token = await fetchSpotifyToken();

    if (!token) {
      throw new Error('access token is invalid.');
    }

    const playlist = await getSpotifyUserPlaylists(userId, token.access_token);

    if (!playlist) {
      throw new Error('No playlist found for this user ID.');
    }
    return { playlist, success: true}

  } catch (error: any) {
    console.log('ERROR SEARCH SPOTIFY USER ACTION : ', error?.message);
    return { error: error?.message || 'Something wen wrong 😴', success: false};
  }
}

export const getSpotifyToken = async () => {

  let token: ISpotifyToken | null = null;

  //SI LE TOKEN EST NULL, ON EN FETCH UN
  if (!token) {
    token = await fetchSpotifyToken();
    return token
  }

  //ON CHECK S'IL EST TOUJOURS VALIDE
  const now = Date.now()
}
