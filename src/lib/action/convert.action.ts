"use server";

import { Origin } from "@/src/components/trackSelector/TrackSelector";
import { convertYoutubeVideoToSpotifyTrack } from "./spotify.action";
import { Playlist } from "@/src/store/Playlist.store";

export const convertACTION = async (tracks: string[], state: unknown, fd: FormData) => {
  try {

    //ON RECUEPERE L'ORIGN DU FORMADATA
    const from = fd.get('from')?.toString() as Origin;

    if (!from) {
      throw new Error('No origin provided.');
    }

    //ON CREE UN PLAYLIST ARRAY, POUR N'AVOIR QU'UN SEUL RETURN,
    //PEU IMPORTE LA METHODE
    const data: Playlist[] = [];

    //ON CALL LA METHODE APPROPRIEE
    if (from === "youtube") {
      const pl = await convertYoutubeVideoToSpotifyTrack(tracks);
      if (!pl) {
        throw new Error('No playlist from convert function.');
      }
      pl.forEach(item => data.push(item));
    }

    return { success: true, data };
    
  } catch (error: any) {
    console.log('ERROR CONVERT ACTION : ', error?.message);
    return { success: false };
  }
}