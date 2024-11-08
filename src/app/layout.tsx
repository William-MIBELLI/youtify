import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import NavBar from "../components/navbar/NavBar";
import { getGoogleSession } from "../lib/auth/google.auth";
import SessionInitializer from "../components/session-initializer/SessionInitializer";
import { getSpotifySession } from "../lib/auth/spotify.auth";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400"],
});

export const metadata: Metadata = {
  title: "Youtify",
  description: "From Spotify to Youtube 🤯",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleData = await getGoogleSession();
  const spotifyData = await getSpotifySession();
  return (
    <html lang="en">
      <SessionInitializer googleData={googleData} spotifyData={spotifyData} />
      <body
        className={`${roboto.className} antialiased bg-gray-950 min-h-screen`}
      >
        <NavBar />
        {children}
      </body>
    </html>
  );
}
