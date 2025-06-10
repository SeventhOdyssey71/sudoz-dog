import type React from "react"
import type { Metadata } from "next"
import { Orbitron } from "next/font/google"
import "./globals.css"
import "@mysten/dapp-kit/dist/index.css"
import ClientProviders from "./providers"
import TermsDialog from "./components/TermsDialog"
import { Toaster } from "@/components/ui/sonner"

const orbitron = Orbitron({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sudoz Evolution Lab",
  description: "Evolve your Sudoz NFTs in our experimental sci-fi lab. Level up, enhance, and unlock the true potential of your digital artifacts.",
  keywords: ["NFT", "Evolution", "Digital Art", "Blockchain", "Sudoz"],
  authors: [{ name: "Sudoz Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
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
