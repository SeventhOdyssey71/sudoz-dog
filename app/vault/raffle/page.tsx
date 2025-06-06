"use client"

import { Ticket, Trophy, Users, Star } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const mockStats = [
  { icon: <Trophy className="w-8 h-8 mb-2 text-purple-300" />, value: '18', label: 'Active Raffles' },
  { icon: <Users className="w-8 h-8 mb-2 text-purple-300" />, value: '9,432', label: 'Total Participants' },
  { icon: <Star className="w-8 h-8 mb-2 text-purple-300" />, value: '98', label: 'Prizes Awarded' },
]

const mockRaffles = [
  {
    title: 'SUDOZ NFT Raffle',
    description: 'Win 1 of 5 rare SUDOZ NFTs with unique traits and abilities.',
    prize: '5 Rare NFTs',
    prizeColor: 'text-orange-400',
    entries: 876,
    timeLeft: '3 days',
    active: true,
  },
  {
    title: 'SUDOZ Token Raffle',
    description: 'Massive token raffle for active community members.',
    prize: '25,000 SUDOZ Tokens',
    prizeColor: 'text-fuchsia-400',
    entries: 654,
    timeLeft: '4 days',
    active: true,
  },
]

export default function RafflePage() {
  const [entered, setEntered] = useState(false)
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-start px-2 py-8 md:py-12">
      {/* Hero Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="rounded-full bg-purple-900/60 border-4 border-purple-400/30 p-6 mb-4 animate-glow">
          <Ticket className="w-12 h-12 text-purple-300" />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-purple-300 mb-2 tracking-wider text-center drop-shadow-lg">Holder Raffles</h1>
        <p className="text-base md:text-lg text-gray-200 text-center max-w-xl mb-2">Exclusive raffles for verified SUDOZ holders. Connect your wallet to participate!</p>
      </div>
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-8">
        {mockStats.map((stat, i) => (
          <div key={i} className="bg-purple-900/40 border border-purple-400/20 rounded-xl flex flex-col items-center p-6 shadow-lg animate-glow">
            {stat.icon}
            <div className="text-2xl font-bold text-purple-300 mb-1">{stat.value}</div>
            <div className="text-gray-300 text-sm text-center">{stat.label}</div>
          </div>
        ))}
      </div>
      {/* Raffles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {mockRaffles.map((r, i) => (
          <div key={i} className="bg-purple-100/10 border-2 border-purple-400/20 rounded-2xl p-6 shadow-xl flex flex-col animate-glow relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-purple-300">{r.title}</span>
              {r.active && <span className="bg-purple-400/20 text-purple-400 text-xs font-bold px-3 py-1 rounded-full">Active</span>}
            </div>
            <p className="text-gray-200 text-sm mb-3">{r.description}</p>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="text-sm text-gray-400">Prize: <span className={`font-bold ${r.prizeColor}`}>{r.prize}</span></div>
              <div className="text-sm text-gray-400">Entries: <span className="font-bold text-purple-300">{r.entries}</span></div>
              <div className="text-sm text-gray-400 flex items-center gap-1">Time Left: <span className="font-bold text-white">{r.timeLeft}</span></div>
            </div>
            <Button className="w-full bg-gray-600 hover:bg-gray-600 text-gray-400 font-bold px-8 py-3 text-lg rounded-xl cursor-not-allowed mt-auto" disabled>
              Coming Soon
            </Button>
          </div>
        ))}
      </div>
      <Link href="/vault" className="text-purple-300 underline hover:text-purple-400 transition mt-8">Back to Vault</Link>
      <style jsx global>{`
        .animate-glow {
          box-shadow: 0 0 24px 4px #a259ff33, 0 0 48px 8px #a259ff22;
        }
      `}</style>
    </div>
  )
} 