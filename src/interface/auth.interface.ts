import { Credentials } from "google-auth-library";

export type AuthenticationStatus =
  | "Unauthenticated"
  | "Loading"
  | "Authenticated";

export type AuthProvider = "spotify" | "google";

export interface GoogleSessionToken extends Credentials {
  limitDate: number;
}

export interface UserData {
  name: string;
  email: string;
  id: string;
  picture?: string;
}

export interface SpotifyToken {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  refresh_token: string;
  scope: string;
  limitDate: number;
}
