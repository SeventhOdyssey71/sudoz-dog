"use client"

import { Ticket } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function RafflePage() {
  const [entered, setEntered] = useState(false)
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full rounded-2xl border-2 border-purple-400/40 bg-gradient-to-br from-purple-900/80 to-gray-900/90 shadow-lg p-6 md:p-10 animate-glow">
        <div className="flex flex-col items-center">
          <Ticket className="w-14 h-14 text-purple-400 mb-4 animate-bounce" />
          <h1 className="text-2xl md:text-4xl font-extrabold text-purple-300 mb-2 tracking-wider text-center">Raffles</h1>
          <p className="text-base md:text-lg text-gray-200 text-center mb-6">Enter raffles for a chance to win rare SUDOZ artifacts and other rewards.</p>
          {!entered ? (
            <Button className="w-full bg-purple-500 hover:bg-purple-400 text-white font-bold px-8 py-3 text-lg rounded-xl mb-4 animate-glow" onClick={() => setEntered(true)}>
              Enter Raffle
            </Button>
          ) : (
            <div className="w-full bg-purple-700/80 text-purple-100 text-center font-bold rounded-xl px-8 py-3 mb-4 animate-glow">You are entered! Good luck!</div>
          )}
          <Link href="/vault" className="text-purple-300 underline hover:text-purple-400 transition">Back to Vault</Link>
        </div>
      </div>
      <style jsx global>{`
        .animate-glow {
          box-shadow: 0 0 24px 4px #a259ff33, 0 0 48px 8px #a259ff22;
        }
      `}</style>
    </div>
  )
} 