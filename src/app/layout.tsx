import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Roboto,  Pacifico, Yellowtail, Monoton } from 'next/font/google'
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import Container from "../components/Container";


const roboto = Roboto({
  subsets: ['latin'],
  weight: ["100", "300", "400"]
})
const titleFont = Yellowtail({
  weight: ["400"],
  subsets:['latin']
})

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
      <>
        <body
          className={`${roboto.className} antialiased bg-gray-950 min-h-screen`}
        >
          <nav className="w-full py-2 px-6   mb-8">
            <Link href={'/'}>
              <h1 className={`text-7xl my-2 w-fit text-gray-400 hover:text-gray-300 ${titleFont.className} `}>Youtify</h1>
            </Link>
          </nav>
          <Container>
            {children}

          </Container>
        </body>
      </>
    </html>
  );
}
