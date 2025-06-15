"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Zap, Flame, Shield, AlertTriangle, CheckCircle, Coins, Activity, HelpCircle, ArrowRight } from "lucide-react"

export default function DocumentationPage() {
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
        <div className="text-xl font-bold text-green-400 tracking-wider">EVOLUTION DOCUMENTATION</div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-16 md:py-24 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center tracking-wider">SUDOZ EVOLUTION LAB DOCUMENTATION</h1>
        <p className="text-center text-gray-400 mb-16 text-lg">Learn how to evolve your Sudoz artifacts and unlock their full potential.</p>
        
        <div className="space-y-12">
          {/* Getting Started */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-green-400 flex items-center gap-2">
                <Zap className="w-6 h-6" />
                GETTING STARTED
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <p className="leading-relaxed text-base text-white">
                Welcome to the SUDOZ Evolution Lab!
              </p>
              <p className="leading-relaxed text-base text-white">
                This experimental facility lets you upgrade your Artifact NFTs and unlock enhanced value as you progress.
              </p>
              <ol className="space-y-3 list-decimal list-inside ml-6 text-white text-base">
                <li>Connect your wallet to access your Artifact collection</li>
                <li>Navigate to the Evolve Lab</li>
                <li>Select an Artifact from your collection</li>
                <li>Choose to Level Up or Burn your Artifact</li>
                <li>Reach Level 10 to unlock the option to burn your Artifact and claim a SUDOZ NFT (limited to 5555, first come, first served)</li>
              </ol>
            </CardContent>
          </Card>

          {/* Collection Overview */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-green-400 flex items-center gap-2">
                <Zap className="w-6 h-6" />
                Collection Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <p className="leading-relaxed text-base text-white">
                Understanding the relationship between SUDOZ NFTs and Artifacts is crucial to participating in the ecosystem.
              </p>
              
              <div className="bg-black/50 p-6 rounded-lg border border-gray-800 mt-6">
                <h4 className="font-semibold text-white mb-4">COLLECTION STRUCTURE:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-400 mb-2">5,555</p>
                    <p className="text-white font-semibold">SUDOZ NFTs</p>
                    <p className="text-sm text-gray-400">Main Collection</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-cyan-400 mb-2">13,500+</p>
                    <p className="text-white font-semibold">Artifacts</p>
                    <p className="text-sm text-gray-400">Evolution Materials</p>
                  </div>
                </div>
                
                <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-600/30 mt-4">
                  <h5 className="font-semibold text-yellow-400 mb-2">🎯 HOW TO CLAIM A SUDOZ NFT:</h5>
                  <p className="text-white text-base mb-2">
                    To claim a SUDOZ NFT, you must level up your Artifact to level 10, then burn it to receive one SUDOZ.
                  </p>
                  <p className="text-white text-base">
                    SUDOZ is available on a <span className="text-yellow-400 font-bold">first-come, first-served</span> basis — once all 5555 are claimed, no more can be minted.
                  </p>
                </div>

                <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-600/30 mt-4">
                  <h5 className="font-semibold text-blue-400 mb-2">🔮 AFTER ALL SUDOZ ARE CLAIMED:</h5>
                  <p className="text-white text-base">
                    After all SUDOZ are claimed, you can still use your remaining Artifacts for future events, refund and utility in the SUDOZ ecosystem.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Level Up System */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-green-400 flex items-center gap-2">
                <Activity className="w-6 h-6" />
                LEVEL UP SYSTEM
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed text-white">
                The Level Up system allows you to enhance your Sudoz artifacts through 10 progressive levels, with each level providing additional points and benefits.
              </p>
              
              <div className="bg-black/50 p-6 rounded-lg border border-gray-800 mt-6">
                <h4 className="font-semibold text-white mb-3">HOW IT WORKS:</h4>
                <ul className="space-y-3 text-white text-base">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>Each level up costs exactly 1 SUI (total 10 SUI for levels 1-10)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>Maximum level is 10 for all artifacts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>Starting at level 0, each artifact has 2 points</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>Each level gained adds 1 additional point (e.g., level 5 = 7 points)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>Points determine number of entries in giveaways</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>Image and metadata update with each level</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Burn Mechanism */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-red-400 flex items-center gap-2">
                <Flame className="w-6 h-6" />
                BURN MECHANISM
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed text-white">
                The Burn feature allows you to downgrade your artifacts and receive a partial refund of your level-up costs.
              </p>
              
              <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                <h4 className="font-semibold text-white mb-3">HOW BURNING WORKS:</h4>
                <ul className="space-y-2 text-white">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    <span>You can burn any leveled artifact to receive an 80% refund of the SUI spent on leveling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    <span>For example, if you leveled to level 5 (cost 5 SUI), you'll receive 4 SUI back (80% of 5)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    <span>Burning is useful if you want to downgrade an artifact or recover some of your investment</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-900/20 p-6 rounded-lg border border-red-800/50 mt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-400 mb-1">⚠️ IMPORTANT WARNING</h4>
                    <p className="text-gray-300 text-sm">
                      Burning an artifact is permanent and irreversible. This action will completely remove the NFT from your wallet and the blockchain. You will receive the 80% SUI refund, but the artifact itself will be destroyed forever.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Economics & Technical Details */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-green-400 flex items-center gap-2">
                <Coins className="w-6 h-6" />
                ECONOMICS & TECHNICAL DETAILS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">LEVEL UP COSTS</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">PER LEVEL UP:</span>
                      <span className="text-green-400">1 SUI</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">LEVEL 1 → 10:</span>
                      <span className="text-green-400">10 SUI TOTAL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">GAS FEES:</span>
                      <span className="text-green-400">~0.001 SUI</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3">VALUE INCREASES</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">PER LEVEL:</span>
                      <span className="text-cyan-400">+1 POINT</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h4 className="font-semibold text-white mb-3">BLOCKCHAIN</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="text-gray-300">• Built on Sui Network</li>
                    <li className="text-gray-300">• Smart contract verified</li>
                    <li className="text-gray-300">• Immutable upgrade logic</li>
                    <li className="text-gray-300">• Decentralized metadata</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3">SECURITY</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="text-gray-300">• Audited smart contracts</li>
                    <li className="text-gray-300">• Non-custodial design</li>
                    <li className="text-gray-300">• Transparent operations</li>
                    <li className="text-gray-300">• Community verified</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 bg-black/50 p-6 rounded-lg border border-gray-800">
                <h4 className="font-semibold text-white mb-3">COLLECTION DETAILS:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-400">TOTAL SUPPLY</p>
                    <p className="text-green-400 font-bold">5,555 NFTS</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">MAX LEVEL</p>
                    <p className="text-green-400 font-bold">LEVEL 10</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">UPGRADE COST</p>
                    <p className="text-green-400 font-bold">1 SUI</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400">NETWORK</p>
                    <p className="text-green-400 font-bold">SUI</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-green-400 flex items-center gap-2">
                <HelpCircle className="w-6 h-6" />
                FREQUENTLY ASKED QUESTIONS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-6">
              <div>
                <h4 className="font-semibold text-white mb-2">HOW DOES THE POINT SYSTEM WORK?</h4>
                <p className="text-gray-300 text-sm">
                  Each artifact starts with 2 base points at level 0. Every level you gain adds 1 additional point. For example, a level 5 artifact has 7 points (2 base + 5 level points). These points determine your entries in giveaways and other special events.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">WHAT HAPPENS IF I REACH MAX LEVEL?</h4>
                <p className="text-gray-300 text-sm">
                  Level 10 artifacts represent the highest evolution state with maximum points (12 points total) and visual enhancements. This gives you the maximum number of entries in giveaways and special events.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">ARE THERE ANY RISKS?</h4>
                <p className="text-gray-300 text-sm">
                  Level ups are safe and guaranteed. The only risk is with the Burn function, which permanently destroys the NFT.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">CAN I DOWNGRADE MY ARTIFACTS?</h4>
                <p className="text-gray-300 text-sm">
                  Yes! You can downgrade your artifacts by using the burn feature. When you burn an artifact, you&apos;ll receive 80% of the SUI you spent on leveling it up. However, remember that burning permanently destroys the artifact itself.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">CAN I TRADE UPGRADED ARTIFACTS?</h4>
                <p className="text-gray-300 text-sm">
                  Yes! Upgraded artifacts can be freely traded on any NFT marketplace that supports Sui NFTs. Higher level artifacts typically have increased market value.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Ready to Evolve */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-green-400 text-center">READY TO EVOLVE?</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6 p-6">
              <p className="text-gray-300">
                Enter the Evolution Lab and start upgrading your Sudoz artifacts today. Unlock new levels and earn more points in our experimental sci-fi environment.
              </p>
              <Link href="/evolve-lab">
                <Button
                  size="lg"
                  className="bg-green-400 hover:bg-green-500 text-black px-8 py-4 text-lg font-bold rounded-xl shadow-lg shadow-green-400/25 transition-all duration-300 hover:shadow-green-400/40 hover:scale-105 tracking-wider"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  ENTER EVOLUTION LAB
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
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