'use server';

import { IPlaylistTracksList, ISpotifyToken, IUserPlaylist } from "@/src/interface/spotify.interface";

const API_ENDPOINT = 'https://api.spotify.com/v1'

export const fetchSpotifyToken = async () => {

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  try {

    //ON CHECK SI ON A LES VARIABLES D'ENVIRONNEMENT
    if (!clientId || !clientSecret) {
      throw new Error('Env id or secret miss');
    }

    //ON REQUEST
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: 'POST',
      headers: {
        'Content-type': "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })

    //ON CHECK SI LA RESPONSE EST OK
    if (!response.ok) {
      throw new Error(`Response error, status : ${response.status}`);
    }

    //ON REDCUPERE LE TOKEN
    const data = await response.json() as ISpotifyToken

    //ET ON LE RETURN
    return data

  } catch (error: any) {
    console.log('ERROR GET SPOTIFY TOKEN : ', error?.message);
    return null;
  }
}

export const getSpotifyUserPlaylists = async (userId: string, token: string) => {
  try {

    //ON REQUEST
    const response = await fetch(`${API_ENDPOINT}/users/${userId}/playlists`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    //ON CHECK SI LA RESPONSE EST OK
    if (!response.ok) {
      throw new Error(`Response error, status : ${response.status}`);
    }

    //ON PARSE
    const data = await response.json() as IUserPlaylist;

    //ON MAP POUR IGNORER LES PLAYLISTS SANS TRACKS
    const mappedItems = data.items.filter(item => item?.tracks?.total ? item.tracks?.total > 0 : null);

    const mappedData: IUserPlaylist = { ...data, items: mappedItems };

    return mappedData;

  } catch (error:any) {
    console.log('ERROR GET USER PLAYLIST SPOTIFY : ', error?.message);
    return null;
  }
}

// export const getSpotifyUser = async () => {
//   try {
//     const response = await fetch(`${API_ENDPOINT}/`)
//   } catch (error: any) {
//     console.log('ERROR GET SPOTIFY USER : ', error?.messgae);
//     return null;
//   }
// }

export const getPlaylistTracks = async (playlistId: string) => {
  try {

    //ON FETCH UN TOKEN
    const token = await fetchSpotifyToken();

    if (!token) {
      throw new Error('Invalid token.');
    }

    //ON REQUEST
    const response = await fetch(`${API_ENDPOINT}/playlists/${playlistId}/tracks?market=FR`, {
      method: 'GET',
      headers: {
        'Authorization' : `Bearer ${token.access_token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Response error, status : ${response.status}`);
    }

    const data = await response.json() as IPlaylistTracksList

    return data

  } catch (error:any) {
    console.log('ERROR GET PLYALIST TRACKS : ', error?.message);
    return null;
  }
}