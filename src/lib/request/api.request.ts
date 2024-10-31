'use server';

const API_ENDPOINT = "http://localhost:8000"

export const sendSpotifyPlaylistToAPI = async (playlist: string[]) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/playlist`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        playlist
      })
    })
    if (!response.ok) {
      throw new Error(`Something goes wrong : ${response.status}`);
    }
    const data = await response.json();

    return data;
    
  } catch (error: any) {
    console.log('ERROR SEND PLAYLIST TO API REQUEST : ', error?.message);
    return null;
  }
}