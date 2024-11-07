import { NextAuthOptions, AuthOptions } from "next-auth"
import GoogleProvider from 'next-auth/providers/google'

export const authOptions : NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/youtube',
          access_type: 'offline',
          // ou pour un accès complet :
          // scope: 'openid email profile https://www.googleapis.com/auth/youtube'
        }
      }, 

    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        // Sauvegarde initiale du token lors de la connexion
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at! * 1000; // Conversion en millisecondes
      }

      // Vérifier si le token est expiré
      if (Date.now() < (token.expiresAt as number ?? 0)) {
        return token;
      }

      // Si le token est expiré, essayer de le rafraîchir
      try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_ID!,
            client_secret: process.env.GOOGLE_SECRET!,
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken as string,
          }),
        });

        const tokens = await response.json();

        if (!response.ok) throw tokens;

        return {
          ...token,
          accessToken: tokens.access_token,
          expiresAt: Date.now() + tokens.expires_in * 1000,
        };
      } catch (error) {
        console.error('Error refreshing access token', error);
        return { ...token, error: 'RefreshAccessTokenError' };
      }
    },
    session({ session, token, user }) {

      // Send properties to the client, like an access_token from a provider.
      (session as any).accessToken = token.accessToken;
      (session as any).refreshToken = token.refreshToken;
      return session
    }
  }
} satisfies AuthOptions