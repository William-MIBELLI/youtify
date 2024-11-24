import { create } from "zustand";
import {
  IPlaylistItem,
} from "../interface/youtube.interface";
import { SpotifyTrack } from "../interface/spotify.interface";
import { persist } from "zustand/middleware";

export type PlaylistState = {
  playlist?: Playlist[];
  origin?: PlaylistType;
  createdPlaylistLink?: string

};

export type PlaylistType = "spotify" | "youtube";

export type TrackToConvert = {
  title: string;
  artist: string;
  id: string;
}

export type Playlist = TrackToConvert[] 

export type PlaylistAction = {
  addPlaylist: (
    playlist: Playlist[],
    origin: PlaylistType
  ) => void;
  removePlaylist: () => void;
  addLink: (link: string) => void;
};

export type PlaylistStore = PlaylistAction & PlaylistState;

export const usePlaylistStore = create<PlaylistStore>()(
  persist(
    (set) => ({
      addPlaylist: (playlist, origin) => set({ playlist, origin }),
      removePlaylist: () =>
        set((state) => ({ playlist: undefined, type: undefined })),
      addLink: (link) => set({ createdPlaylistLink: link }),
      }),
      { name: "playlist-storage", skipHydration: true }
    )
  );

