"use client"

import { Gift } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function GiveawayPage() {
  const [entered, setEntered] = useState(false)
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full rounded-2xl border-2 border-green-400/40 bg-gradient-to-br from-green-900/80 to-gray-900/90 shadow-lg p-6 md:p-10 animate-glow">
        <div className="flex flex-col items-center">
          <Gift className="w-14 h-14 text-green-400 mb-4 animate-bounce" />
          <h1 className="text-2xl md:text-4xl font-extrabold text-green-300 mb-2 tracking-wider text-center">Holder Giveaways</h1>
          <p className="text-base md:text-lg text-gray-200 text-center mb-6">Participate in exclusive giveaways for SUDOZ holders. Prizes, NFTs, and more await!</p>
          {!entered ? (
            <Button className="w-full bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-3 text-lg rounded-xl mb-4 animate-glow" onClick={() => setEntered(true)}>
              Enter Giveaway
            </Button>
          ) : (
            <div className="w-full bg-green-700/80 text-green-100 text-center font-bold rounded-xl px-8 py-3 mb-4 animate-glow">You are entered! Winners will be announced soon.</div>
          )}
          <Link href="/vault" className="text-green-300 underline hover:text-green-400 transition">Back to Vault</Link>
        </div>
      </div>
      <style jsx global>{`
        .animate-glow {
          box-shadow: 0 0 24px 4px #00ffae33, 0 0 48px 8px #00ffae22;
        }
      `}</style>
    </div>
  )
} 