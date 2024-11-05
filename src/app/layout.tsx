import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import NavBar from "../components/navbar/NavBar";
import SessionWrapper from "../components/sessionWrapper/SessionWrapper";
import { SpotifyProvider } from "../context/SpotifySession.context";
import { PlaylistContextProvider } from "../context/PlaylistContext.context";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400"],
});

export const metadata: Metadata = {
  title: "Youtify",
  description: "From Spotify to Youtube 🤯",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionWrapper>
        <SpotifyProvider>
          <PlaylistContextProvider>
          <body
            className={`${roboto.className} antialiased bg-gray-950 min-h-screen`}
          >
            <NavBar />
            {children}
          </body>

          </PlaylistContextProvider>
        </SpotifyProvider>
      </SessionWrapper>
    </html>
  );
}
