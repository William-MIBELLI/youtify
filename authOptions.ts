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
          prompt: 'consent'
          // ou pour un accès complet :
          // scope: 'openid email profile https://www.googleapis.com/auth/youtube'
        }
      }, 

    })
  ],
  callbacks: {
    jwt({ token, account }) {
      console.log('JWT : ', token);
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
      return token
    },
    session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      (session as any).accessToken = token.accessToken;
      (session as any).refreshToken = token.refreshToken;
      return session
    }
  }
} satisfies AuthOptions