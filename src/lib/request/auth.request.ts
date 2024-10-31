'use server';

import { ReadLine } from "readline";
import { google } from "googleapis";


export const authorize = async () => {

  //CREDENTIALS
  const { YOUTUBE_OAUTH_ID, YOUTUBE_OAUTH_SECRET } = process.env;

  if (!YOUTUBE_OAUTH_ID || !YOUTUBE_OAUTH_SECRET) {
    console.log('CREDENTIAL MISSED. ');
    return null;
  }

  try {
    //ON CREE LE CLIENT
    const authClient = new google.auth.OAuth2({
      clientId: YOUTUBE_OAUTH_ID,
      clientSecret: YOUTUBE_OAUTH_SECRET,
      redirectUri: 'http://localhost:3000/from-youtube'
    })
    const authUrl = authClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/youtube.readonly']
    })
    console.log('Authorize this app by visiting this page : ', authUrl);
  
    const token = await authClient.getAccessToken();
  
    console.log('token : ', token);

    return true;
  } catch (error:any) {
    console.log('ERROR : ', error?.message);
    return null;
  }
}