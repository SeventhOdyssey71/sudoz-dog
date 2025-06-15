"use client"

import { Flame } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function BurnPage() {
  const [burned, setBurned] = useState(false)
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full rounded-2xl border-2 border-red-400/40 bg-gradient-to-br from-red-900/80 to-gray-900/90 shadow-lg p-6 md:p-10 animate-glow">
        <div className="flex flex-col items-center">
          <Flame className="w-14 h-14 text-red-400 mb-4 animate-bounce" />
          <h1 className="text-2xl md:text-4xl font-extrabold text-red-300 mb-2 tracking-wider text-center">Sacrifice System</h1>
          <p className="text-base md:text-lg text-gray-200 text-center mb-6">Burn your SUDOZ for a chance at legendary rewards. High risk, high reward!</p>
          {!burned ? (
            <Button className="w-full bg-red-500 hover:bg-red-400 text-white font-bold px-8 py-3 text-lg rounded-xl mb-4 animate-glow" onClick={() => setBurned(true)}>
              Burn for a Chance
            </Button>
          ) : (
            <div className="w-full bg-red-700/80 text-red-100 text-center font-bold rounded-xl px-8 py-3 mb-4 animate-glow">You have burned for a chance!</div>
          )}
          <Link href="/vault" className="text-red-300 underline hover:text-red-400 transition">Back to Vault</Link>
        </div>
      </div>
      <style jsx global>{`
        .animate-glow {
          box-shadow: 0 0 24px 4px #ff3c3c33, 0 0 48px 8px #ff3c3c22;
        }
      `}</style>
    </div>
  )
} 