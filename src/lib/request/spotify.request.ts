'use server';

const API_ENDPOINT = 'https://api.spotify.com/v1'

export const getSpotifyToken = async () => {

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
    const data = await response.json() as {
      access_token: string;
      token_type: string;
      expires_in: number;
    };

    //ET ON LE RETURN
    return data

  } catch (error: any) {
    console.log('ERROR GET SPOTIFY TOKEN : ', error?.message);
    return null;
  }
}

export const getUserPlaylists = async (userId: string, token: string) => {
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

    const data = await response.json();

    return data;

  } catch (error:any) {
    console.log('ERROR GET USER PLAYLIST SPOTIFY : ', error?.message);
    return null;
  }
}