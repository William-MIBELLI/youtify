import { create } from "zustand";
import {
  IPlaylistItem,
} from "../interface/youtube.interface";
import { SpotifyTrack } from "../interface/spotify.interface";
import { persist } from "zustand/middleware";

export type PlaylistState = {
  playlist?: Playlist;
  type?: PlaylistType;
  playlistName?: string;
};

export type PlaylistType = "spotify" | "youtube";

export type Playlist = {
  title: string;
  artist: string;
  id: string;
}[]

export type PlaylistAction = {
  addPlaylist: (
    playlist: Playlist,
    type: PlaylistType
  ) => void;
  removePlaylist: () => void;
};

export type PlaylistStore = PlaylistAction & PlaylistState;

export const usePlaylistStore = create<PlaylistStore>()(
    persist(
      (set) => ({
        addPlaylist: (playlist, type) => set({ playlist, type }),
        removePlaylist: () =>
          set((state) => ({ playlist: undefined, type: undefined })),
      }),
      { name: "playlist-storage", skipHydration: true }
    )
  );

