import type React from "react"
import type { Metadata } from "next"
import { Orbitron } from "next/font/google"
import "./globals.css"
import "@mysten/dapp-kit/dist/index.css"
import ClientProviders from "./providers"
import TermsDialog from "./components/TermsDialog"
import { Toaster } from "@/components/ui/sonner"

const orbitron = Orbitron({ subsets: ["latin"] })

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: "Sudoz Evolution Lab",
  description: "Evolve your Sudoz NFTs in our experimental sci-fi lab. Level up, enhance, and unlock the true potential of your digital artifacts.",
  keywords: ["NFT", "Evolution", "Digital Art", "Blockchain", "Sudoz"],
  authors: [{ name: "Sudoz Team" }],
  robots: "index, follow",
  icons: {
    icon: [
      { url: "/fav.png", type: "image/png" },
      { url: "/fav.png", sizes: "32x32", type: "image/png" },
      { url: "/fav.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/fav.png",
    apple: "/fav.png",
    other: [
      {
        rel: "icon",
        url: "/fav.png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sudoz.io",
    title: "Sudoz Evolution Lab",
    description: "Evolve your Sudoz NFTs in our experimental sci-fi lab",
    siteName: "Sudoz Evolution Lab"
  },
  twitter: {
    card: "summary_large_image",
    title: "Sudoz Evolution Lab",
    description: "Evolve your Sudoz NFTs in our experimental sci-fi lab",
    creator: "@sudoz"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/fav.png" type="image/png" />
        <link rel="shortcut icon" href="/fav.png" type="image/png" />
        <link rel="apple-touch-icon" href="/fav.png" />
      </head>
      <body className={orbitron.className}>
        <ClientProviders>
          {children}
          <TermsDialog />
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  )
}
