"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Zap, Flame, Coins, Shield, TrendingUp, Users } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black text-gray-300 relative overflow-hidden">
      {/* Background blur elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl moving-blur-1"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/8 rounded-full blur-3xl moving-blur-2"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white tracking-wide">
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK TO HOME
            </Button>
          </Link>
        </div>
        <div className="text-xl font-bold text-green-400 tracking-wider">DOCUMENTATION</div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-12 md:py-20 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center tracking-wider">📜 SUDOZ Project – User Participation Agreement</h1>
        
        <p className="mb-6 leading-relaxed">
          By participating in the SUDOZ ecosystem — including interaction with Artifacts, Dog NFTs, and related experiences — you (“the User”) acknowledge and agree to the following terms:
        </p>
        <hr className="border-gray-700 my-8" />

        <div className="space-y-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-green-400 mb-3 tracking-wide">1. Imaginative Experience</h2>
            <p className="leading-relaxed">
              The SUDOZ project is entirely fictional. All narratives involving animals, including dogs or experiments, are part of a creative storyline. These depictions do not reflect real-world actions, beliefs, or intentions. No animals were harmed, nor is harm promoted in any way through this project.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-green-400 mb-3 tracking-wide">2. Experimental Gameplay</h2>
            <p className="leading-relaxed">
              SUDOZ is designed as a gamified and experimental NFT ecosystem. Features such as “leveling up,” “burning,” and “evolution” are metaphorical mechanics for user interaction and engagement. Participation in these features is entirely optional.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-green-400 mb-3 tracking-wide">3. Use of Funds</h2>
            <p className="leading-relaxed">
              Any SUI or cryptocurrency used to interact with the project (e.g., level-ups, transactions) is spent voluntarily. These actions are initiated by the user and are non-refundable. The project creators do not hold responsibility for individual financial decisions.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-green-400 mb-3 tracking-wide">4. No Financial Guarantees</h2>
            <p className="leading-relaxed">
              SUDOZ makes no promises or guarantees regarding the financial value of any NFTs, including Dog NFTs or Artifacts. The floor price, resale value, and market performance are determined solely by the open market and community consensus.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-green-400 mb-3 tracking-wide">5. Community-Driven Ecosystem</h2>
            <p className="leading-relaxed">
              All progression, decisions, and developments in the SUDOZ universe are community-driven. No central authority dictates future price movements or rewards. You acknowledge that you are engaging with the ecosystem at your own discretion.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-green-400 mb-3 tracking-wide">6. Art Usage & Attribution</h2>
            <p className="leading-relaxed">
              <ul>
                <li><strong>Artifacts Collection:</strong> All visuals are AI-generated and used purely for storytelling and aesthetic purposes.</li>
                <li><strong>Dog NFT Collection:</strong> Artwork is created by human artists commissioned for the project.</li>
              </ul>
              By engaging, you accept that some visual content may use generative AI tools and is not intended to mislead.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-green-400 mb-3 tracking-wide">7. No Promises of Utility</h2>
            <p className="leading-relaxed">
              This project is not a financial product or a guaranteed reward system. It does not offer staking, passive income, or future token airdrops unless explicitly announced. All features are subject to change based on development and community feedback.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-green-400 mb-3 tracking-wide">8. Assumption of Risk</h2>
            <p className="leading-relaxed">
              By participating, you understand and accept that all interactions — including purchases, upgrades, burns, and marketplace trading — involve inherent risk. You are responsible for your own actions and choices within the SUDOZ ecosystem.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-green-400 mb-3 tracking-wide">9. Final Agreement</h2>
            <p className="leading-relaxed">
              By continuing to engage with the SUDOZ project, you acknowledge that:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>You have read and understood this agreement.</li>
              <li>You voluntarily accept all terms without coercion or expectation of return.</li>
              <li>You are solely responsible for your decisions and interactions within the ecosystem.</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-gray-400 border-t border-gray-800">
        <p className="tracking-wide text-sm">&copy; 2025 SUDOZ GENETIC RESEARCH LABORATORY. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  )
}
