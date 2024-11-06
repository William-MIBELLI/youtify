import { create } from "zustand";
import {
  IPlaylistItem,
  IYoutubePlaylist,
} from "../interface/youtube.interface";
import { SpotifyTrack } from "../interface/spotify.interface";
import Spotify from "next-auth/providers/spotify";
import { persist } from "zustand/middleware";

export type PlaylistState = {
  playlist?: IPlaylistItem[] | SpotifyTrack[];
  type?: PlaylistType;
  playlistName?: string;
};

export type PlaylistType = "spotify" | "youtube";

export type PlaylistAction = {
  addPlaylist: (
    playlist: IPlaylistItem[] | SpotifyTrack[],
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

