import { Credentials } from "google-auth-library";

export type AuthenticationStatus = 'Unauthenticated' | 'Loading' | 'Authenticated';

export interface GoogleSessionToken extends Credentials{ }

export interface GoogleUserData {
  name: string;
  email: string;
  id: string
  picture?: string;
}