"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Zap, Flame, Coins, Shield, TrendingUp, Users, Star, Gift, AlertCircle } from "lucide-react"

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

      <main className="relative z-10 container mx-auto px-6 py-12 md:py-20 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center tracking-wider">📜 SUDOZ Evolution Lab - Complete Guide</h1>
        
        <p className="mb-6 leading-relaxed text-center text-gray-400">
          Welcome to the SUDOZ Evolution Lab documentation. Learn everything about evolving your Artifacts and maximizing your rewards.
        </p>
        <hr className="border-gray-700 my-8" />

        <div className="space-y-8">
          {/* Evolution System */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-green-400 flex items-center gap-2">
                <Zap className="w-6 h-6" />
                Evolution System Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed">
                The SUDOZ main collection comes from evolving Artifacts through 10 distinct levels. Each evolution transforms your digital specimen, unlocking new visual characteristics and increasing its value within the ecosystem.
              </p>
              <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                <h4 className="font-semibold text-white mb-2">Total Evolution Cost:</h4>
                <p className="text-green-400 text-xl">10 SUI for complete evolution (Level 1 to Level 10)</p>
              </div>
            </CardContent>
          </Card>

          {/* SUDOZ NFTs and Artifacts Relationship */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-green-400 flex items-center gap-2">
                <AlertCircle className="w-6 h-6" />
                SUDOZ NFTs & Artifacts: The Connection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                <h4 className="font-semibold text-white mb-3">Key Information:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>There are a total of <span className="text-green-400 font-bold">5555 SUDOZ NFTs</span> and <span className="text-cyan-400 font-bold">13,500+ Artifacts</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>To claim a SUDOZ NFT, you must <span className="text-yellow-400 font-bold">level up your Artifact to level 10</span>, then burn it to receive one SUDOZ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>SUDOZ is available on a <span className="text-red-400 font-bold">first-come, first-served basis</span> — once all 5555 are claimed, no more can be minted</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>After all SUDOZ are claimed, you can still use your remaining Artifacts for <span className="text-purple-400 font-bold">future events, refund and utility</span> in the SUDOZ ecosystem</span>
                  </li>
                </ul>
              </div>
              <div className="bg-yellow-400/10 p-4 rounded-lg border border-yellow-400/30">
                <p className="text-sm text-yellow-400">
                  <strong>Important:</strong> Not all Artifacts will become SUDOZ NFTs. With 13,500+ Artifacts and only 5,555 SUDOZ available, strategic timing and participation are key!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Level Costs */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-green-400 flex items-center gap-2">
                <Coins className="w-6 h-6" />
                Evolution Level Costs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                  <div key={level} className="bg-black/50 p-3 rounded-lg border border-gray-800 text-center">
                    <p className="text-sm text-gray-400">Level {level}</p>
                    <p className="text-lg font-bold text-green-400">1 SUI</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-400 text-center">
                Each evolution level costs 1 SUI, with cumulative progression building your specimen's power.
              </p>
            </CardContent>
          </Card>

          {/* Point System */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-green-400 flex items-center gap-2">
                <Star className="w-6 h-6" />
                Point System & Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                <h4 className="font-semibold text-white mb-3">How Points Work:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>Level 0 (Base): 2 points</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>Each level increase: +1 point</span>
                  </li>
                </ul>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { level: 0, points: 2 },
                  { level: 1, points: 3 },
                  { level: 2, points: 4 },
                  { level: 3, points: 5 },
                  { level: 4, points: 6 },
                  { level: 5, points: 7 },
                  { level: 6, points: 8 },
                  { level: 7, points: 9 },
                  { level: 8, points: 10 },
                  { level: 9, points: 11 },
                  { level: 10, points: 12 },
                ].map(({ level, points }) => (
                  <div key={level} className="bg-black/30 p-2 rounded border border-gray-800 text-center">
                    <p className="text-xs text-gray-400">Level {level}</p>
                    <p className="font-bold text-green-400">{points} pts</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Giveaway System */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-green-400 flex items-center gap-2">
                <Gift className="w-6 h-6" />
                Giveaway Entry System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed">
                Your Artifact&apos;s level directly impacts your chances in community giveaways. Higher levels mean more entries!
              </p>
              <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                <h4 className="font-semibold text-white mb-3">Example:</h4>
                <p className="text-gray-300">
                  If you own a Level 5 Artifact (7 points), you receive <span className="text-green-400 font-bold">7 entries/tickets</span> in each giveaway you participate in.
                </p>
              </div>
              <p className="text-sm text-gray-400">
                This reward system incentivizes evolution while maintaining fairness for all community members.
              </p>
            </CardContent>
          </Card>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-gray-400 border-t border-gray-800">
        <p className="tracking-wide text-sm">&copy; 2025 SUDOZ GENETIC RESEARCH LABORATORY. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  )
}