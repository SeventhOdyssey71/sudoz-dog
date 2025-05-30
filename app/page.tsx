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
  Shield,
  Users,
  TrendingUp,
  Eye,
  AlertTriangle,
  Menu,
  CheckCircle,
} from "lucide-react"
import { useState } from "react"

export default function HomePage() {
  const [navOpen, setNavOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
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
      <header className="relative z-10 flex items-center justify-between px-4 py-3 md:p-6">
        <div className="text-xl md:text-3xl font-bold text-green-400 tracking-wider flex items-center">
          SUDOZ
        </div>
        <div className="md:hidden">
          <button onClick={() => setNavOpen(!navOpen)} className="text-green-400 focus:outline-none z-50">
            <Menu className="w-7 h-7" />
          </button>
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

      <main className="relative z-10 container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <section className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] px-2 md:px-6 text-center">
            <div className="mb-6 md:mb-12">
              <div className="inline-flex items-center px-3 py-1.5 md:px-6 md:py-3 bg-green-400/20 border border-green-400/40 rounded-full text-green-400 text-xs md:text-lg mb-4 md:mb-8 tracking-wider">
                <Beaker className="w-3 h-3 md:w-5 md:h-5 mr-1.5 md:mr-3" />
                WELCOME TO SUDOZ LABS
              </div>
              <h1 className="text-3xl md:text-7xl font-bold text-white mb-4 md:mb-8 leading-tight tracking-wider">
                THE SUDOZ
                <span className="block text-green-400 relative">
                  COLLECTION
                  <div className="absolute -top-2 md:-top-4 -right-2 md:-right-4 w-4 md:w-8 h-4 md:h-8 bg-green-400/30 rounded-full blur-lg pulse-neon"></div>
                </span>
              </h1>
              <p className="text-xs md:text-2xl text-gray-300 max-w-xs md:max-w-4xl mx-auto mb-6 md:mb-12 leading-relaxed">
                Deep within the SUDOZ laboratories, a breakthrough in digital genetics has emerged. Your NFTs are no longer
                static artifacts—they are <span className="text-green-400 font-bold">living entities</span>
                capable of evolution, mutation, and transcendence beyond imagination.
              </p>
              <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-12">
                <Badge
                  variant="secondary"
                  className="bg-red-500/20 text-red-400 border-red-400/30 px-3 py-1 text-xs md:text-lg tracking-wider"
                >
                  <AlertTriangle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  EXPERIMENTAL
                </Badge>
             
                <Badge
                  variant="secondary"
                  className="bg-cyan-500/20 text-cyan-400 border-cyan-400/30 px-3 py-1 text-xs md:text-lg tracking-wider"
                >
                  <Activity className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  LIVE EVOLUTION
                </Badge>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:gap-6 mb-4 md:mb-16 w-full max-w-xs md:max-w-none mx-auto">
                <Link href="/evolve-lab" className="block w-full">
                  <Button
                    size="lg"
                    className="w-full bg-green-400 hover:bg-green-500 text-black px-4 md:px-12 py-3 md:py-6 text-base md:text-xl font-bold rounded-xl shadow-lg shadow-green-400/25 transition-all duration-300 hover:shadow-green-400/40 hover:scale-105 tracking-wider"
                  >
                    <Zap className="w-4 h-4 md:w-6 md:h-6 mr-2 md:mr-3" />
                    ENTER THE LAB
                    <ArrowRight className="w-4 h-4 md:w-6 md:h-6 ml-2 md:ml-3" />
                  </Button>
                </Link>
                <Link href="/collection" className="block w-full">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-green-400 text-green-400 hover:bg-green-400/10 hover:text-green-300 px-4 md:px-12 py-3 md:py-6 text-base md:text-xl font-bold rounded-xl transition-all duration-300 hover:scale-105 tracking-wider"
                  >
                    <Sparkles className="w-4 h-4 md:w-6 md:h-6 mr-2 md:mr-3" />
                    VIEW COLLECTION
                  </Button>
                </Link>
                <Link href="/vault" className="block w-full">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300 px-4 md:px-12 py-3 md:py-6 text-base md:text-xl font-bold rounded-xl transition-all duration-300 hover:scale-105 tracking-wider"
                  >
                    <Shield className="w-4 h-4 md:w-6 md:h-6 mr-2 md:mr-3" />
                    ENTER THE VAULT
                  </Button>
                </Link>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="animate-bounce">
              <div className="w-6 h-10 border-2 border-green-400/50 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-green-400 rounded-full mt-2 animate-pulse"></div>
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
                    Each SUDOZ artifact contains a unique genetic code—a digital DNA sequence that determines its traits, rarity, and evolutionary potential. Through our proprietary Level Protocol Interface, you can now manipulate this code directly.
                  </p>
                  <div className="space-y-2 md:space-y-4">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs md:text-base text-gray-300">10 Evolution Levels Per Artifact</span>
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span className="text-xs md:text-base text-gray-300">Randomized Trait Generation</span>
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
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 md:mb-8 tracking-wider">THE SPECIMEN COLLECTION</h2>
                <p className="text-base md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                  5,555 unique digital life forms await evolution. Each specimen contains distinct genetic markers and
                  evolutionary potential. The collection represents the first successful attempt at creating truly living
                  NFTs.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-16">
                <Card className="bg-gray-900/80 border-gray-700 text-center p-3 md:p-6">
                  <div className="text-2xl md:text-4xl font-bold text-green-400 tracking-wider mb-1 md:mb-2">5,555</div>
                  <div className="text-xs md:text-sm text-gray-400 tracking-wider">TOTAL SPECIMENS</div>
                </Card>
                <Card className="bg-gray-900/80 border-gray-700 text-center p-3 md:p-6">
                  <div className="text-2xl md:text-4xl font-bold text-cyan-400 tracking-wider mb-1 md:mb-2">2,847</div>
                  <div className="text-xs md:text-sm text-gray-400 tracking-wider">ACTIVE RESEARCHERS</div>
                </Card>
                <Card className="bg-gray-900/80 border-gray-700 text-center p-3 md:p-6">
                  <div className="text-2xl md:text-4xl font-bold text-purple-400 tracking-wider mb-1 md:mb-2">1,203</div>
                  <div className="text-xs md:text-sm text-gray-400 tracking-wider">EVOLVED ENTITIES</div>
                </Card>
                <Card className="bg-gray-900/80 border-gray-700 text-center p-3 md:p-6">
                  <div className="text-2xl md:text-4xl font-bold text-yellow-400 tracking-wider mb-1 md:mb-2">47</div>
                  <div className="text-xs md:text-sm text-gray-400 tracking-wider">REBIRTH EVENTS</div>
                </Card>
              </div>

              <div className="text-center">
                <Link href="/collection">
                  <Button
                    size="lg"
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 text-base md:px-10 md:py-4 md:text-lg font-bold rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-105 tracking-wider"
                  >
                    <Eye className="w-4 h-4 mr-2 md:w-5 md:h-5 md:mr-3" />
                    BROWSE SPECIMENS
                    <ArrowRight className="w-4 h-4 ml-2 md:w-5 md:h-5 md:ml-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Warning Section */}
          <section className="relative z-10 py-16 md:py-32 px-6 bg-red-900/10">
            <div className="container mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center px-3 py-1 md:px-6 md:py-3 bg-red-500/20 border border-red-500/40 rounded-full text-red-400 text-xs md:text-lg mb-4 md:mb-8 tracking-wider">
                <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
                CLASSIFIED WARNING
              </div>

              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-8 tracking-wider">PROCEED WITH CAUTION</h2>
              <p className="text-sm md:text-xl text-gray-300 mb-8 md:mb-12 leading-relaxed">
                The SUDOZ Evolution Laboratory operates beyond the boundaries of conventional science. Genetic modifications
                are permanent and irreversible. Evolution beyond Level 10 may result in consequences that our research team
                cannot predict or control.
              </p>

              <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
                <div className="p-4 md:p-6 bg-gray-900/50 border border-red-400/30 rounded-xl">
                  <Shield className="w-6 h-6 md:w-8 md:h-8 text-red-400 mx-auto mb-3 md:mb-4" />
                  <h4 className="text-base md:text-lg font-bold text-white mb-1 md:mb-2 tracking-wide">IRREVERSIBLE CHANGES</h4>
                  <p className="text-xs md:text-sm text-gray-400">All genetic modifications are permanent and cannot be undone</p>
                </div>
                <div className="p-4 md:p-6 bg-gray-900/50 border border-yellow-400/30 rounded-xl">
                  <Activity className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 mx-auto mb-3 md:mb-4" />
                  <h4 className="text-base md:text-lg font-bold text-white mb-1 md:mb-2 tracking-wide">UNKNOWN OUTCOMES</h4>
                  <p className="text-xs md:text-sm text-gray-400">Evolution results are governed by quantum randomness</p>
                </div>
                <div className="p-4 md:p-6 bg-gray-900/50 border border-purple-400/30 rounded-xl">
                  <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-400 mx-auto mb-3 md:mb-4" />
                  <h4 className="text-base md:text-lg font-bold text-white mb-1 md:mb-2 tracking-wide">RESEARCH PURPOSES</h4>
                  <p className="text-xs md:text-sm text-gray-400">Participation contributes to ongoing genetic research</p>
                </div>
              </div>

              <p className="text-sm md:text-lg text-gray-400 mb-6 md:mb-8">
                By entering the laboratory, you acknowledge the experimental nature of this technology and accept full
                responsibility for any evolutionary outcomes.
              </p>

              <Link href="/evolve-lab">
                <Button
                  size="lg"
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 text-base md:px-10 md:py-4 md:text-lg font-bold rounded-xl shadow-lg shadow-red-500/25 transition-all duration-300 hover:shadow-red-500/40 hover:scale-105 tracking-wider"
                >
                  <AlertTriangle className="w-5 h-5 mr-3" />I UNDERSTAND THE RISKS
                  <ArrowRight className="w-5 h-5 ml-3" />
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

                <Link href="/docs">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-gray-400 text-gray-400 hover:bg-gray-400/10 hover:text-white px-6 py-3 text-base md:px-12 md:py-6 md:text-xl font-bold rounded-xl transition-all duration-300 hover:scale-105 tracking-wider"
                  >
                    <TrendingUp className="w-6 h-6 mr-3" />
                    RESEARCH DOCS
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-12 text-gray-400 border-t border-gray-800">
        <p className="tracking-wide text-lg">&copy; 2025 SUDOZ GENETIC RESEARCH LABORATORY. ALL RIGHTS RESERVED.</p>
        <p className="text-sm mt-2">EXPERIMENTAL TECHNOLOGY - PROCEED AT YOUR OWN RISK</p>
      </footer>
    </div>
  )
}
