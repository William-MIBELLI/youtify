import NextAuth, { NextAuthOptions, AuthOptions} from "next-auth";
import GoogleProvider from 'next-auth/providers/google'


export const authOptions : NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/youtube.readonly'
          // ou pour un accès complet :
          // scope: 'openid email profile https://www.googleapis.com/auth/youtube'
        }
      }, 
    }),
    // ...add more providers here
  ],
  callbacks: {
    jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      (session as any).accessToken = token.accessToken
      return session
    }
  }
} satisfies AuthOptions

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

