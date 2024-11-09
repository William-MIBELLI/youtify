import { AuthProvider, GoogleSessionToken, SpotifyToken } from "@/src/interface/auth.interface";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

let client: OAuth2Client | null = null;

export const getOauthClient = () => {
  if (!client) {
    client = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      redirectUri: process.env.GOOGLE_REDIRECT_URI as string,
    });
  }

  return client;
};

export const updateCookie = async (token: SpotifyToken | GoogleSessionToken, provider: AuthProvider) => {
  try {

    const url = process.env.URL_REFRESH_TOKEN as string;
    
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        stringifiedToken: JSON.stringify(token),
        provider
      })
    })
    return true
  } catch (error: any) {
    console.log('ERROR UPDATE COOKIE : ', error?.message);
    return false;
  }

}
