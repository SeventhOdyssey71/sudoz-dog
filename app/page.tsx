"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Zap,
  Beaker,
  Sparkles,
  Dna,
  Activity,
  Eye,
  AlertTriangle,
  CheckCircle,
  FlaskConical,
} from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export default function HomePage() {
  const [navOpen, setNavOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Announcement Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-red-400/20 backdrop-blur-md border-b border-red-400/30 text-red-100 py-2 overflow-hidden">
        <div className="relative">
          <div className="animate-scroll-left whitespace-nowrap">
            <span className="inline-block px-8 font-light tracking-wider">
              🚨 Evolve labs is LIVE now! Upgrade and level up your artifacts.. 🚨
            </span>
            <span className="inline-block px-8 font-light tracking-wider">
              🚨 Evolve labs is LIVE now! Upgrade and level up your artifacts.. 🚨
            </span>
            <span className="inline-block px-8 font-light tracking-wider">
              🚨 Evolve labs is LIVE now! Upgrade and level up your artifacts..🚨
            </span>
          </div>
        </div>
      </div>
      {/* Moving animated background blurs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/20 rounded-full blur-3xl moving-blur-1"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl moving-blur-2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-300/10 rounded-full blur-3xl moving-blur-3"></div>
        <div className="absolute top-3/4 left-1/3 w-72 h-72 bg-purple-400/8 rounded-full blur-3xl moving-blur-1"></div>
        <div className="absolute bottom-1/2 right-1/2 w-56 h-56 bg-cyan-300/12 rounded-full blur-3xl moving-blur-2"></div>
      </div>

      {/* Enhanced neon particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full pulse-neon"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-cyan-400 rounded-full pulse-neon"></div>
        <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-green-300 rounded-full pulse-neon"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-cyan-300 rounded-full pulse-neon"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400 rounded-full pulse-neon"></div>
        <div className="absolute bottom-1/3 left-1/6 w-1 h-1 bg-green-500 rounded-full pulse-neon"></div>
        <div className="absolute top-2/3 right-1/6 w-2 h-2 bg-cyan-500 rounded-full pulse-neon"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-3 md:p-6 mt-10">
        <div className="text-xl md:text-3xl font-bold text-green-400 tracking-wider flex items-center">
          SUDOZ
        </div>
        {/* Mobile nav overlay */}
        {navOpen && <div className="fixed inset-0 bg-black z-40 md:hidden" onClick={() => setNavOpen(false)}></div>}
        {/* Nav menu */}
        <nav className={`fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center space-y-8 text-2xl font-bold text-green-400 transition-transform duration-300 md:static md:bg-transparent md:flex md:flex-row md:items-center md:justify-end md:space-y-0 md:space-x-8 md:text-base md:font-normal ${navOpen ? 'translate-x-0 bg-black z-50 pointer-events-auto' : '-translate-x-full pointer-events-none'} md:translate-x-0 md:pointer-events-auto`}>
          <button onClick={() => setNavOpen(false)} className="absolute top-6 right-6 text-white md:hidden">✕</button>
        </nav>
      </header>

      {showSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-400/20 border border-green-400/40 rounded-xl p-4 flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-bold tracking-wide">{successMessage}</span>
          </div>
        </div>
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20 md:py-32 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black/90"></div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-7xl mx-auto text-center">
            <div className="space-y-6 md:space-y-8">
              <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tight">
                Welcome to
                <span className="block text-green-400 mt-2">Sudoz</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                A community-driven NFT ecosystem where imagination meets innovation. 
                Join us in crafting the future of digital collectibles.
              </p>
              <div className="flex flex-col gap-4 md:flex-row md:gap-6 justify-center">
                <Link href="/evolve-lab" className="block w-full md:w-auto">
                  <Button
                    size="lg"
                    className="w-full bg-green-400 hover:bg-green-500 text-black px-8 md:px-12 py-6 md:py-8 text-lg md:text-xl font-bold rounded-xl transition-all duration-300 hover:scale-105 tracking-wider"
                  >
                    <FlaskConical className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
                    ENTER THE LAB
                  </Button>
                </Link>
                <Link href="https://www.tradeport.xyz/sui/collection/0x5c67326d96aa593599722a174b1f358036f3b6ee3a42eccf3065aa02d9ecc666%3A%3Aevolved_sudoz%3A%3AEvolvedSudoz?bottomTab=trades&tab=items">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-green-400 text-green-400 hover:bg-green-400/10 hover:text-green-300 px-8 md:px-12 py-6 md:py-8 text-lg md:text-xl font-bold rounded-xl transition-all duration-300 hover:scale-105 tracking-wider"
                  >
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
                    COLLECTION
                  </Button>
                </Link>
                <Link href="/vault" className="block w-full md:w-auto">
                  <Button
                    size="lg"
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white px-8 md:px-12 py-6 md:py-8 text-lg md:text-xl font-bold rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-105 tracking-wider"
                  >
                    THE VAULT
                  </Button>
                </Link>
              </div>
            </div>

            {/* Key Features Section */}
            <div className="mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-green-400/20">
                <h3 className="text-xl font-bold text-green-400 mb-3">Community-Driven</h3>
                <p className="text-gray-300">Shape the future of SUDOZ through community consensus and active participation.</p>
              </div>
              <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-green-400/20">
                <h3 className="text-xl font-bold text-green-400 mb-3">Imaginative Experience</h3>
                <p className="text-gray-300">Engage with a creative storyline where all narratives are fictional and artistic.</p>
              </div>
              <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-green-400/20">
                <h3 className="text-xl font-bold text-green-400 mb-3">Transparent Ecosystem</h3>
                <p className="text-gray-300">Clear terms and conditions with no hidden promises or financial guarantees.</p>
              </div>
            </div>
          </div>
        </section>

        {/* The Discovery Section */}
        <section className="relative z-10 py-8 md:py-32 px-2 md:px-6">
          <div className="container mx-auto max-w-lg md:max-w-6xl">
            <div className="text-center mb-8 md:mb-20">
              <h2 className="text-2xl md:text-6xl font-bold text-white mb-4 md:mb-8 tracking-wider">THE DISCOVERY</h2>
              <p className="text-xs md:text-xl text-gray-300 max-w-xs md:max-w-4xl mx-auto leading-relaxed">
                In the depths of blockchain technology, SUDOZ scientists have unlocked the secret to digital DNA manipulation. What was once impossible is now reality—NFTs that grow, evolve, and transform before your eyes.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center mb-8 md:mb-20">
              <div>
                <h3 className="text-lg md:text-4xl font-bold text-green-400 mb-3 md:mb-6 tracking-wider">GENETIC BREAKTHROUGH</h3>
                <p className="text-xs md:text-lg text-gray-300 mb-3 md:mb-6 leading-relaxed">
                There are 7 different types of Artifacts.
When you level up the first time, you get one of them at random. From that point on, all your future levels stay within that same type.


                </p>
                <div className="space-y-2 md:space-y-4">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs md:text-base text-gray-300">10 Evolution Levels Per Artifact</span>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-3">
                    

                  </div>
                  <div className="flex items-center space-x-2 md:space-x-3">
                  
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="w-full h-40 md:h-80 bg-gray-900/50 rounded-xl border border-green-400/30 flex items-center justify-center">
                  <div className="text-center">
                    <Dna className="w-10 h-10 md:w-24 md:h-24 text-green-400 mx-auto mb-2 md:mb-4 animate-pulse" />
                    <div className="text-green-400 font-bold tracking-wider text-xs md:text-base">DNA SEQUENCE ACTIVE</div>
                    <div className="text-gray-400 text-xs md:text-sm mt-1 md:mt-2">DNA97/2309/57A2</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Collection Stats Section */}
        <section className="relative z-10 py-16 md:py-32 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-8 md:mb-20">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 md:mb-8 tracking-wider">THE SUDOZ COLLECTION</h2>
              <p className="text-base md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                5,555 unique digital life forms await evolution. Each specimen contains distinct genetic markers and
                evolutionary potential. The collection represents the first successful attempt at creating truly living
                NFTs.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-16">
              <Card className="bg-gray-900/80 border-gray-700 text-center p-3 md:p-6">
                <div className="text-2xl md:text-4xl font-bold text-green-400 tracking-wider mb-1 md:mb-2">5,555</div>
                <div className="text-xs md:text-sm text-gray-400 tracking-wider">TOTAL SUDOZ</div>
              </Card>
              <Card className="bg-gray-900/80 border-gray-700 text-center p-3 md:p-6">
                <div className="text-2xl md:text-4xl font-bold text-cyan-400 tracking-wider mb-1 md:mb-2">?</div>
                <div className="text-xs md:text-sm text-gray-400 tracking-wider">ACTIVE RESEARCHERS</div>
              </Card>
              <Card className="bg-gray-900/80 border-gray-700 text-center p-3 md:p-6">
                <div className="text-2xl md:text-4xl font-bold text-purple-400 tracking-wider mb-1 md:mb-2">?</div>
                <div className="text-xs md:text-sm text-gray-400 tracking-wider">EVOLVED ENTITIES</div>
              </Card>
              <Card className="bg-gray-900/80 border-gray-700 text-center p-3 md:p-6">
                <div className="text-2xl md:text-4xl font-bold text-yellow-400 tracking-wider mb-1 md:mb-2">?</div>
                <div className="text-xs md:text-sm text-gray-400 tracking-wider">REBIRTH EVENTS</div>
              </Card>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                className="bg-gray-600 hover:bg-gray-600 text-gray-400 px-6 py-3 text-base md:px-10 md:py-4 md:text-lg font-bold rounded-xl cursor-not-allowed tracking-wider"
                disabled
              >
                <Eye className="w-4 h-4 mr-2 md:w-5 md:h-5 md:mr-3" />
                BROWSE SUDOZ
                <ArrowRight className="w-4 h-4 ml-2 md:w-5 md:h-5 md:ml-3" />
              </Button>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="relative z-10 py-16 md:py-32 px-6 bg-yellow-900/10">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-8 tracking-wider">ABOUT SUDOZ</h2>
            <p className="text-sm md:text-xl text-gray-300 mb-8 md:mb-12 leading-relaxed">
            SUDOZ is a collection of 5,555 digital dog specimens made for those who appreciate dogs, clean PFPs, and internet culture with a twist. Each SUDOZ carries its own unique look — blending vibes, energy, and just the right amount of chaos.

Built on the Sui blockchain, SUDOZ lives at the edge of experimental storytelling and digital expression. No promises, no pressure — just a community-driven project exploring what happens when creativity, tech, and culture collide.

Whether you're here to collect, connect, or simply enjoy the ride — welcome to SUDOZ.
            </p>
            <Link href="https://x.com/TheSUDOZ" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 text-base md:px-10 md:py-4 md:text-lg font-bold rounded-xl shadow-lg shadow-yellow-500/25 transition-all duration-300 hover:shadow-yellow-500/40 hover:scale-105 tracking-wider"
              >
                VISIT SOCIALS
              </Button>
            </Link>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative z-10 py-16 md:py-32 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 md:mb-8 tracking-wider">
              THE FUTURE IS
              <span className="block text-green-400">EVOLVING</span>
            </h2>
            <p className="text-base md:text-2xl text-gray-300 mb-8 md:mb-12 leading-relaxed">
              Join the genetic revolution. Transform your static NFTs into living, breathing digital entities. The
              laboratory awaits your arrival.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
              <Link href="/evolve-lab">
                <Button
                  size="lg"
                  className="bg-green-400 hover:bg-green-500 text-black px-6 py-3 text-base md:px-12 md:py-6 md:text-xl font-bold rounded-xl shadow-lg shadow-green-400/25 transition-all duration-300 hover:shadow-green-400/40 hover:scale-105 tracking-wider"
                >
                  <Zap className="w-6 h-6 mr-3" />
                  BEGIN EVOLUTION
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>

              <Link href="/documentation">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-400 text-gray-400 hover:bg-gray-400/10 hover:text-white px-6 py-3 text-base md:px-12 md:py-6 md:text-xl font-bold rounded-xl transition-all duration-300 hover:scale-105 tracking-wider"
                >
                  VIEW DOCUMENTATION
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-12 text-gray-400 border-t border-gray-800">
        <p className="tracking-wide text-lg">&copy; 2025 SUDOZ GENETIC RESEARCH LABORATORY. ALL RIGHTS RESERVED.</p>
        <p className="text-sm mt-2">EXPERIMENTAL TECHNOLOGY - PROCEED AT YOUR OWN RISK</p>
      </footer>
    </div>
  )
}
