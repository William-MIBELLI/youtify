import { PlaylistItemForSelector } from "@/src/components/trackSelector/TrackSelector";
import { PlaylistItem } from "../request/youtube.request";
import { IPlaylistTracksList, SpotifyToken } from "@/src/interface/spotify.interface";

export const mapYTPlaylist = (
  itemsList: PlaylistItem
): PlaylistItemForSelector[] => {
  const mapped = itemsList
    .filter((item) => item?.snippet?.title && item.id)
    .map((item) => {
      // const titleParts = item.snippet?.title?.split("-");
      // const title = titleParts?.[1]?.trim() || item.snippet?.title || "";
      // const artist = titleParts?.[0]?.trim() || "";
      const [title, artist] = mapYoutubeTitle(item.snippet?.title || undefined)
      return {
        title,
        artist,
        id: item.id!,
      };
    });
  return mapped;
};

export const mapSpotifyPlaylist = (
  tracksList: IPlaylistTracksList
): PlaylistItemForSelector[] => {
  const mapped = tracksList.items.map((item) => {
    return {
      title: item.track.name,
      artist: item.track.artists[0].name,
      id: item.track.id,
      duration: item.track.duration_ms,
    };
  });
  return mapped;
};

export const mapYoutubeTitle = (titlePart: string | undefined) => {
  const split = titlePart?.split("-").reverse();
  const title = split?.[0]?.trim() || titlePart || "";
  const artist = split?.[1]?.trim() || "";
  return [title, artist];
}

export const mapCheckGroupValueToURLParams = (list: string[]) => {
  const mapped = list.map(item => {
    const [track, artist] = mapYoutubeTitle(item);
    const url = encodeURIComponent(`track=${track}&artist=${artist}`)
    return url;
  })

  return mapped;
}
export const addLimitDate = (token: Omit<SpotifyToken, 'limitDate'>): SpotifyToken => {
  const limitDate = Date.now();
  return { ...token, limitDate };
 }