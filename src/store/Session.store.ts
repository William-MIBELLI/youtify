import { create } from "zustand";
import { SpotifyToken } from "../interface/spotify.interface";
import { persist } from "zustand/middleware";
import { AuthenticationStatus, GoogleUserData } from "../interface/auth.interface";


export type SessionState = {
  spotifyToken?: SpotifyToken;
  googleData: GoogleUserData | undefined;
  spotifyData: GoogleUserData | undefined;
  googleStatus: AuthenticationStatus;
  spotifyStatus: AuthenticationStatus;
}

export type SessionAction = {
  setGoogle: (data: GoogleUserData | undefined, status: AuthenticationStatus) => void;
  // setSpotify: () => void
}

export type SessionStore = SessionAction & SessionState;

const initialState: SessionState = {
  googleStatus: 'Unauthenticated',
  spotifyStatus: 'Unauthenticated',
  googleData: undefined,
  spotifyData: undefined
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setGoogle: (data, status) => set({ googleData: data, googleStatus: status }),
    }),
    { name: 'session-storage', skipHydration: true }
  )
);