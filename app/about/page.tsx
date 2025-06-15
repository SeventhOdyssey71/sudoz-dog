import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Moving animated background blurs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/8 rounded-full blur-3xl moving-blur-1"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/6 rounded-full blur-3xl moving-blur-2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-300/5 rounded-full blur-3xl moving-blur-3"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white tracking-wide">
              BACK
            </Button>
          </Link>
          <div className="text-2xl font-bold text-green-400 tracking-wider">ABOUT SUDOZ</div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-8 max-w-4xl">
        <div className="text-center py-16 md:py-32 px-6 bg-yellow-900/10 rounded-xl">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-8 tracking-wider">ABOUT SUDOZ</h2>
            <p className="text-sm md:text-xl text-gray-300 mb-8 md:mb-12 leading-relaxed">
            SUDOZ is a collection of 5,555 digital dog SUDOZ made for those who appreciate dogs, clean PFPs, and internet culture with a twist. Each SUDOZ carries its own unique look — blending vibes, energy, and just the right amount of chaos.

Built on the Sui blockchain, SUDOZ lives at the edge of experimental storytelling and digital expression. No promises, no pressure — just a community-driven project exploring what happens when creativity, tech, and culture collide.

Whether you&apos;re here to collect, connect, or simply enjoy the ride — welcome to SUDOZ.
            </p>
            <Link href="#" /* TODO: Replace # with actual social link */>
              <Button
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 text-base md:px-10 md:py-4 md:text-lg font-bold rounded-xl shadow-lg shadow-yellow-500/25 transition-all duration-300 hover:shadow-yellow-500/40 hover:scale-105 tracking-wider"
              >
                View Socials
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
} 