import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthenticationStatus, UserData } from "../interface/auth.interface";

export type SessionState = {
  googleData: UserData | undefined;
  spotifyData: UserData | undefined;
  googleStatus: AuthenticationStatus;
  spotifyStatus: AuthenticationStatus;
};

export type SessionAction = {
  setGoogle: (data: UserData | undefined) => void;
  setSpotify: (data: UserData | undefined) => void;
};

export type SessionStore = SessionAction & SessionState;

const initialState: SessionState = {
  googleStatus: "Loading",
  spotifyStatus: "Loading",
  googleData: undefined,
  spotifyData: undefined,
};

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setGoogle: (data) =>
        set({
          googleData: data,
          googleStatus: data ? "Authenticated" : "Unauthenticated",
        }),
      setSpotify: (data) =>
        set({
          spotifyData: data,
          spotifyStatus: data ? "Authenticated" : "Unauthenticated",
        }),
    }),
    { name: "session-storage", skipHydration: true }
  )
);
