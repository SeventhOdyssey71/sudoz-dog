"use client"

import { Flame, Trophy, Users, Star } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const mockStats = [
  { icon: <Trophy className="w-8 h-8 mb-2 text-red-300" />, value: '12', label: 'Active Burn Events' },
  { icon: <Users className="w-8 h-8 mb-2 text-red-300" />, value: '7,654', label: 'Total Participants' },
  { icon: <Star className="w-8 h-8 mb-2 text-red-300" />, value: '78', label: 'Prizes Awarded' },
]

const mockBurnEvents = [
  {
    title: 'SUDOZ NFT Burn',
    description: 'Burn your SUDOZ NFTs for a chance to win rare rewards.',
    prize: '5 Rare NFTs',
    prizeColor: 'text-orange-400',
    entries: 543,
    timeLeft: '1 day',
    active: true,
  },
  {
    title: 'SUDOZ Token Burn',
    description: 'Burn your SUDOZ tokens for a chance to win massive rewards.',
    prize: '15,000 SUDOZ Tokens',
    prizeColor: 'text-fuchsia-400',
    entries: 432,
    timeLeft: '2 days',
    active: true,
  },
]

export default function BurnPage() {
  const [entered, setEntered] = useState(false)
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-start px-2 py-8 md:py-12">
      {/* Hero Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="rounded-full bg-red-900/60 border-4 border-red-400/30 p-6 mb-4 animate-glow">
          <Flame className="w-12 h-12 text-red-300" />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-red-300 mb-2 tracking-wider text-center drop-shadow-lg">Holder Burn Events</h1>
        <p className="text-base md:text-lg text-gray-200 text-center max-w-xl mb-2">Exclusive burn events for verified SUDOZ holders. Connect your wallet to participate!</p>
      </div>
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-8">
        {mockStats.map((stat, i) => (
          <div key={i} className="bg-red-900/40 border border-red-400/20 rounded-xl flex flex-col items-center p-6 shadow-lg animate-glow">
            {stat.icon}
            <div className="text-2xl font-bold text-red-300 mb-1">{stat.value}</div>
            <div className="text-gray-300 text-sm text-center">{stat.label}</div>
          </div>
        ))}
      </div>
      {/* Burn Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {mockBurnEvents.map((b, i) => (
          <div key={i} className="bg-red-100/10 border-2 border-red-400/20 rounded-2xl p-6 shadow-xl flex flex-col animate-glow relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-red-300">{b.title}</span>
              {b.active && <span className="bg-red-400/20 text-red-400 text-xs font-bold px-3 py-1 rounded-full">Active</span>}
            </div>
            <p className="text-gray-200 text-sm mb-3">{b.description}</p>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="text-sm text-gray-400">Prize: <span className={`font-bold ${b.prizeColor}`}>{b.prize}</span></div>
              <div className="text-sm text-gray-400">Entries: <span className="font-bold text-red-300">{b.entries}</span></div>
              <div className="text-sm text-gray-400 flex items-center gap-1">Time Left: <span className="font-bold text-white">{b.timeLeft}</span></div>
            </div>
            <Button className="w-full bg-gray-600 hover:bg-gray-600 text-gray-400 font-bold px-8 py-3 text-lg rounded-xl cursor-not-allowed mt-auto" disabled>
              Coming Soon
            </Button>
          </div>
        ))}
      </div>
      <Link href="/vault" className="text-red-300 underline hover:text-red-400 transition mt-8">Back to Vault</Link>
      <style jsx global>{`
        .animate-glow {
          box-shadow: 0 0 24px 4px #ff3c3c33, 0 0 48px 8px #ff3c3c22;
        }
      `}</style>
    </div>
  )
} 