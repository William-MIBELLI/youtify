'use server';

import { createPlaylistOnSpotify } from "../request/spotify.request";

export const createSpotifyPlaylistACTION = async (list: string[], state: unknown, fd: FormData) => {
  try {

    //ON CHECK LES INPUTS VALUES
    const title = fd.get('title')?.toString();
    const visibility = fd.get('visibility')?.toString();
    const userId = fd.get('userId')?.toString()

    if (!title || !visibility || !userId) {
      throw new Error('Some mandatories informations are missing for playlist creation.');
    }

    //ON CREE LA PLAYLIST ET ON RECUPERE SON ID
    const playlistId = await createPlaylistOnSpotify(userId, title, visibility);

    if (!playlistId) {
      throw new Error('PlaylistId is null.');
    }

    //ICI ON DOIT RAJOUTER LES TRACKS A LA PLAYLIST FRAICHEMENT CREEE

    return { success: true, playlistId };
  } catch (error: any) {
    console.log('ERROR CREATE SPOTIFY PLAYLIST ACTION : ', error?.message);
    return { success: false, error: error?.message || 'Something wents wrong.' };
  }
}