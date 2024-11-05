'use server';

import { ISpotifyRequestToken, SpotifyTrack } from "@/src/interface/spotify.interface";
import { fetchSpotifyToken, getSpotifyUserPlaylists, retrieveTrackOnSpotify } from "../request/spotify.request";
import { mapCheckGroupValueToURLParams } from "../helpers/mapper";

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

  let token: ISpotifyRequestToken | null = null;

  //SI LE TOKEN EST NULL, ON EN FETCH UN
  if (!token) {
    token = await fetchSpotifyToken();
    return token
  }

  //ON CHECK S'IL EST TOUJOURS VALIDE
  const now = Date.now()
}

export const convertYoutubeVideoToSpotifyTrack = async (tracks: string[], state: unknown, fd: FormData) => {
  try {

    //ON CREE UN TABLEAU VIDE DE TRACKS SPOTIFY
    const result: SpotifyTrack[] = [];

    //ON MAP LES SELECTEDTRACKS VERS DES URLSEARCHPARAMS
    const mappedTracks = mapCheckGroupValueToURLParams(tracks);

    //ON LOOP SUR CHAQUE URL
    const spotifyTracks = await Promise.all(mappedTracks.map(async (params) => {

      //ON CALL L'API SPOTIFY POUR RECUP LE TRACK CORRESPONDANT
      const track = await retrieveTrackOnSpotify(params);

      //SI ON A UN TRACKS, ON LE PUSH DANS RESULT
      if (track) {
        return track
      }
    }))     

    //ON FILTRE POUR ENELEVE LES UNDEFINED
    const filtered = spotifyTracks.filter(item => item !== undefined)

    return { success: true, data: filtered};
  } catch (error: any) {
    console.log('ERROR CONVERT YOUTUBE VIDEO TO SPOTIFY ACTION : ', error?.message);
    return { error: error?.message || 'Something goes wrong', success: false };
  }
}
