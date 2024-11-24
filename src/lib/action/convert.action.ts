"use server";

import { Origin } from "@/src/components/trackSelector/TrackSelector";
import { convertYoutubeVideoToSpotifyTrack } from "./spotify.action";
import { Playlist } from "@/src/store/Playlist.store";
import { scrapVideoOnYoutube } from "../request/youtube.request";

export const convertACTION = async (
  tracks: string[],
  state: unknown,
  fd: FormData
) => {
  try {
    //ON RECUEPERE L'ORIGN DU FORMADATA
    const from = fd.get("from")?.toString() as Origin;

    if (!from) {
      throw new Error("No origin provided.");
    }

    //ON CALL LA METHODE APPROPRIEE
    const pl: Playlist[] | null =
      from === "youtube"
        ? await convertYoutubeVideoToSpotifyTrack(tracks)
        : await scrapVideoOnYoutube(tracks);
    
    if (!pl) {
      throw new Error("No playlist from convert function.");
    }

    return { success: true, data: pl };

  } catch (error: any) {
    console.log("ERROR CONVERT ACTION : ", error?.message);
    return { success: false };
  }
};
