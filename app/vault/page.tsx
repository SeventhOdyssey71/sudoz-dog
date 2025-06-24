'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Gift, Ticket, Flame, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const VaultPage = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated neon background blurs */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-green-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-2/3 left-2/3 w-60 h-60 bg-red-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
        {/* Neon grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,128,0.08)_0%,transparent_70%)] pointer-events-none" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="w-full flex justify-start mb-4">
          <Link href="/">
            <button className="flex items-center text-green-400 hover:text-green-300 font-bold text-sm md:text-base">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
          </Link>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-green-400 tracking-widest text-center mb-4">
          THE VAULT
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 mb-10 max-w-2xl text-center">
          Welcome to <span className="text-green-400 font-bold">The Vault</span>. Unlock exclusive events, raffles, and high-stakes sacrifices for SUDOZ holders.
        </p>

        <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
          {/* Holder Giveaways */}
          <Link href="/vault/giveaway" className="block">
            <div className="bg-gradient-to-br from-green-900/60 to-gray-900/80 border-2 border-green-400/30 rounded-2xl p-6 shadow-lg hover:shadow-green-400/30 transition-all duration-300 group relative overflow-hidden cursor-pointer hover:border-green-400/50">
              <Gift className="w-12 h-12 text-green-400 mb-4 mx-auto animate-bounce" />
              <h2 className="text-xl md:text-2xl font-bold text-green-300 mb-2 tracking-wide text-center">Holder Giveaways</h2>
              <p className="text-gray-300 text-center mb-4">Participate in exclusive giveaways for SUDOZ holders. Prizes, NFTs, and more await!</p>
              <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-bold">Enter Giveaways</Button>
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-green-400/10 rounded-full blur-2xl animate-pulse" />
            </div>
          </Link>

          {/* Raffles */}
          <div className="bg-gradient-to-br from-purple-900/60 to-gray-900/80 border-2 border-purple-400/30 rounded-2xl p-6 shadow-lg hover:shadow-purple-400/30 transition-all duration-300 group relative overflow-hidden">
            <Ticket className="w-12 h-12 text-purple-400 mb-4 mx-auto animate-bounce" />
            <h2 className="text-xl md:text-2xl font-bold text-purple-300 mb-2 tracking-wide text-center">Raffles</h2>
            <p className="text-gray-300 text-center mb-4">Enter raffles for a chance to win rare SUDOZ artifacts and other rewards.</p>
            <Button className="w-full bg-gray-600 hover:bg-gray-600 text-gray-400 font-bold cursor-not-allowed" disabled>Coming Soon</Button>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl animate-pulse" />
          </div>

          {/* Sacrifice System (Burn & Chances) */}
          <Link href="/vault/burn" className="block">
            <div className="bg-gradient-to-br from-red-900/60 to-gray-900/80 border-2 border-red-400/30 rounded-2xl p-6 shadow-lg hover:shadow-red-400/30 transition-all duration-300 group relative overflow-hidden cursor-pointer hover:border-red-400/50">
              <Flame className="w-12 h-12 text-red-400 mb-4 mx-auto animate-bounce" />
              <h2 className="text-xl md:text-2xl font-bold text-red-300 mb-2 tracking-wide text-center">Sacrifice System</h2>
              <p className="text-gray-300 text-center mb-4">Burn your SUDOZ for a chance at legendary rewards. High risk, high reward!</p>
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold">Enter Sacrifice</Button>
              <div className="absolute top-1/2 right-0 w-24 h-24 bg-red-400/10 rounded-full blur-2xl animate-pulse" />
            </div>
          </Link>
        </div>
      </div>

      {/* Custom CSS for neon and animation effects */}
      <style jsx global>{`
        .animate-text-glow {
          text-shadow: 0 0 8px #00ffae, 0 0 24px #a259ff, 0 0 32px #ff3c3c;
        }
        .animate-glow {
          box-shadow: 0 0 16px 2px #00ffae33, 0 0 32px 4px #a259ff22, 0 0 48px 8px #ff3c3c22;
        }
        .animate-dialog-glow {
          box-shadow: 0 0 32px 4px #00ffae44, 0 0 64px 8px #a259ff33, 0 0 96px 16px #ff3c3c33;
        }
      `}</style>
    </div>
  )
}

export default VaultPage 