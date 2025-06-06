"use client"

import { Gift, Trophy, Users, Star } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const mockStats = [
  { icon: <Trophy className="w-8 h-8 mb-2 text-green-300" />, value: '24', label: 'Active Giveaways' },
  { icon: <Users className="w-8 h-8 mb-2 text-green-300" />, value: '12,847', label: 'Total Participants' },
  { icon: <Star className="w-8 h-8 mb-2 text-green-300" />, value: '156', label: 'Prizes Awarded' },
]

const mockGiveaways = [
  {
    title: 'Legendary SUDOZ NFT Collection',
    description: 'Win 1 of 10 rare legendary SUDOZ NFTs with unique traits and abilities.',
    prize: '10 Legendary NFTs',
    prizeColor: 'text-orange-400',
    entries: 1247,
    timeLeft: '2 days',
    active: true,
  },
  {
    title: 'SUDOZ Token Airdrop',
    description: 'Massive token airdrop for active community members.',
    prize: '50,000 SUDOZ Tokens',
    prizeColor: 'text-fuchsia-400',
    entries: 892,
    timeLeft: '5 days',
    active: true,
  },
]

export default function GiveawayPage() {
  const [entered, setEntered] = useState(false)
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-start px-2 py-8 md:py-12">
      {/* Hero Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="rounded-full bg-green-900/60 border-4 border-green-400/30 p-6 mb-4 animate-glow">
          <Gift className="w-12 h-12 text-green-300" />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-green-300 mb-2 tracking-wider text-center drop-shadow-lg">Holder Giveaways</h1>
        <p className="text-base md:text-lg text-gray-200 text-center max-w-xl mb-2">Exclusive giveaways for verified SUDOZ holders. Connect your wallet to participate!</p>
      </div>
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-8">
        {mockStats.map((stat, i) => (
          <div key={i} className="bg-green-900/40 border border-green-400/20 rounded-xl flex flex-col items-center p-6 shadow-lg animate-glow">
            {stat.icon}
            <div className="text-2xl font-bold text-green-300 mb-1">{stat.value}</div>
            <div className="text-gray-300 text-sm text-center">{stat.label}</div>
          </div>
        ))}
      </div>
      {/* Giveaways List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {mockGiveaways.map((g, i) => (
          <div key={i} className="bg-green-100/10 border-2 border-green-400/20 rounded-2xl p-6 shadow-xl flex flex-col animate-glow relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-green-300">{g.title}</span>
              {g.active && <span className="bg-green-400/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full">Active</span>}
            </div>
            <p className="text-gray-200 text-sm mb-3">{g.description}</p>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="text-sm text-gray-400">Prize: <span className={`font-bold ${g.prizeColor}`}>{g.prize}</span></div>
              <div className="text-sm text-gray-400">Entries: <span className="font-bold text-green-300">{g.entries}</span></div>
              <div className="text-sm text-gray-400 flex items-center gap-1">Time Left: <span className="font-bold text-white">{g.timeLeft}</span></div>
            </div>
            <Button className="w-full bg-gray-600 hover:bg-gray-600 text-gray-400 font-bold px-8 py-3 text-lg rounded-xl cursor-not-allowed mt-auto" disabled>
              Coming Soon
            </Button>
          </div>
        ))}
      </div>
      <Link href="/vault" className="text-green-300 underline hover:text-green-400 transition mt-8">Back to Vault</Link>
      <style jsx global>{`
        .animate-glow {
          box-shadow: 0 0 24px 4px #00ffae33, 0 0 48px 8px #00ffae22;
        }
      `}</style>
    </div>
  )
} 