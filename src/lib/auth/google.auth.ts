"use server";

import { google, GoogleApis } from "googleapis";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AuthenticationStatus,
  GoogleSessionToken,
  GoogleUserData,
} from "@/src/interface/auth.interface";
import { OAuth2Client } from "google-auth-library";

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

export const loginWithGoogle = async () => {
  //CLIENT OAUTH
  const client = getOauthClient();

  //LES SCOPES D'AUTORISATION
  const scopes = [
    "openid email profile https://www.googleapis.com/auth/youtube",
  ];

  //LE STATE
  const state = crypto.randomUUID();

  //ON SAVE LE STATE DANS UN COOKIE
  cookies().set("google-state", state, {
    httpOnly: true,
    sameSite: true,
  });

  //ON GENERE L'URL DE REDIRECTION
  const authorizationUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    state,
    include_granted_scopes: true,
  });

  redirect(authorizationUrl);
};

export const exchangeCodeForTokens = async (code: string) => {
  try {
    //ON RECUPERE LE CLIENT OAUTH
    const client = getOauthClient();

    //ON DEMANDE UN TOKEN AVEC LE CODE RECU
    const { tokens } = await client.getToken(code);

    //ON CHECK SI LE TOKEN N'EST PAS NULL
    if (!tokens) {
      throw new Error("No tokens received.");
    }

    //ON PASSE LES CREDENTIALS AU CLIENT
    client.setCredentials(tokens);

    //ON RETURN LE TOKEN
    return tokens;
  } catch (error: any) {
    console.log("ERROR ECHANGE CODE FOR TOKEN : ", error?.message);
    return null;
  }
};

export const getGoogleSession = async (): Promise<{
  data: GoogleUserData | null;
  status: AuthenticationStatus;
}> => {
  try {
    //ON RECUPERE LE COOKIE DE LA SESSION
    const cookieSession = await cookies().get("google-session");

    if (!cookieSession) {
      throw new Error("No cookie session for this provider.");
    }

    //ON LE PARSE ET ON LES PASSE AU CLIENT
    const tokens = JSON.parse(cookieSession.value) as GoogleSessionToken;
    const client = getOauthClient();
    client.setCredentials(tokens);


    //ON RECUPERE LES INFO DE L'USER GRACE A SON TOKEN
    const oauth2 = google.oauth2({ version: "v2", auth: client });
    const userinfo = await oauth2.userinfo.get();

    if (!userinfo.data) {
      throw new Error('No data for this user.');
    }

    const userData: GoogleUserData = {
      id: userinfo.data.id || '',
      name: userinfo.data.name || '',
      email: userinfo.data.email || '',
      picture: userinfo.data.picture || undefined,
    };

    return {
      data: userData,
      status: "Authenticated",
    };
  } catch (error: any) {
    console.log("ERROR GET GOOGLE SESSION : ", error?.message);
    return {
      data: null,
      status: "Unauthenticated",
    };
  }
};

export const deleteGoogleSession = async () => {
  try {
    //ON DELETE LE COOKIE DE LA SESSION
    const deleted = await cookies().delete("google-session");

    //ON DELETE LES CRDENTIALS STOCKES DANS LE CLIENT OAUTH
    const client = getOauthClient();

    //ON CHECK SI UN ACCESS TOKEN EST PRESENT
    if (client.credentials.access_token) {
      client.revokeCredentials((error) => {
        console.log('ERROR DELETING CREDENTIALS ON OAUTH CLIENT : ', error?.message)
      });
    }

    return true;
  } catch (error: any) {
    console.log("ERROR DELETE GOOGLE SESSION : ", error?.message);
    return false;
  }
};

export const refreshGoogleToken = async () => {

  try {

    //ON RECUPERE LE COOKIE DE SESSION
    const sessionCookie = await cookies().get('google-session');

    if (!sessionCookie) {
      throw new Error('No session cookie.');
    }
    //ON PARSE LE TOKEN POUR RECUPERER LE REFRESH
    const tokens = JSON.parse(sessionCookie.value) as GoogleSessionToken;

    if (!tokens.refresh_token) {
      throw new Error('No refresh token on cookie.');
    }

    //ON REQUEST UN NOUVEAU TOKEN
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_ID as string,
        client_secret: process.env.GOOGLE_SECRET as string,
        grant_type: 'refresh_token',
        refresh_token: tokens.refresh_token,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const newTokens = await response.json() as GoogleSessionToken;

    //ON REMPLACE LA VALUE DU COOKIE AVEC LE NOUVEAU TOKEN
    await cookies().set('google-session', JSON.stringify(newTokens));

    return true;
  } catch (error: any) {
    console.log('ERROR REFRESH GOOGLE TOKEN : ', error?.message);
    return null;
  }
}