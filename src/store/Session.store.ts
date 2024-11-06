import { create } from "zustand";


export const useSessionStore = create((set) => ({
  youtubeSession: undefined,
  spotifySession: undefined,
  
}))