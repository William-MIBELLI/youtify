import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

let client: OAuth2Client | null = null;

export const getOauthClient = () => {
  if (!client) {
    console.log('ON CREE LE CLIENT');
    client = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      redirectUri: process.env.GOOGLE_REDIRECT_URI as string,
    });
  }
  client.on('tokens', (token) => {
    console.log('TOKENS DANS LE CLIENT : ', token.access_token);
  })

  return client;
};
