import { PlaylistItemForSelector } from "@/src/components/trackSelector/TrackSelector";
import { PlaylistItem } from "../request/youtube.request";
import { IPlaylistTracksList } from "@/src/interface/spotify.interface";

export const mapYTPlaylist = (
  itemsList: PlaylistItem
): PlaylistItemForSelector[] => {
  const mapped = itemsList
    .filter((item) => item?.snippet?.title && item.id)
    .map((item) => {
      const titleParts = item.snippet?.title?.split("-");
      const title = titleParts?.[1]?.trim() || item.snippet?.title || "";
      const artist = titleParts?.[0]?.trim() || "";
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