import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Danfo } from 'next/font/google'
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const danfo = Danfo({
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950`}
      >
        <nav className="w-full p-2 h-24 border-b border-gray-900 mb-8">
          <Link href={'/'}>
            <h1 className={`text-7xl text-gray-400 hover:text-gray-300  ${danfo.className}`}>Youtify</h1>
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
