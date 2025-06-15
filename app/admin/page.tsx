"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Lock } from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import WalletConnect from "../components/WalletConnect";
import { AdminSection } from "@/components/AdminSection";
import { EvolvedStats } from "@/components/EvolvedStats";
import { REVENUE_CONFIG } from "@/constants/contract";

export default function AdminPage() {
  const account = useCurrentAccount();
  
  // Check if user is admin
  const isAdmin = account?.address && (
    account.address === REVENUE_CONFIG.DEV_ADDRESS ||
    account.address === REVENUE_CONFIG.FOUNDER_ADDRESS ||
    account.address === REVENUE_CONFIG.DEPLOYER_ADDRESS
  );

  if (!account) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/15 rounded-full blur-3xl moving-blur-1"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl moving-blur-2"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between p-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white tracking-wide">
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK
            </Button>
          </Link>
          <WalletConnect />
        </header>

        {/* Wallet Connection Required */}
        <main className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wider">ADMIN ACCESS REQUIRED</h2>
          <p className="text-gray-400 mb-8 max-w-2xl text-lg leading-relaxed">
            Connect your admin wallet to access the control panel.
          </p>
          <WalletConnect />
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-400/15 rounded-full blur-3xl moving-blur-1"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-400/10 rounded-full blur-3xl moving-blur-2"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between p-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white tracking-wide">
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK
            </Button>
          </Link>
          <WalletConnect />
        </header>

        {/* Access Denied */}
        <main className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <div className="w-24 h-24 bg-red-900/50 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wider">ACCESS DENIED</h2>
          <p className="text-gray-400 mb-8 max-w-2xl text-lg leading-relaxed">
            This area is restricted to authorized administrators only.
          </p>
          <Link href="/evolve-lab">
            <Button className="bg-red-400 hover:bg-red-500 text-black font-bold">
              RETURN TO LAB
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/15 rounded-full blur-3xl moving-blur-1"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl moving-blur-2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-300/8 rounded-full blur-3xl moving-blur-3"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white tracking-wide">
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK
          </Button>
        </Link>
        <WalletConnect />
      </header>

      <main className="relative z-10 container mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-wider">
            ADMIN CONTROL CENTER
          </h1>
          <p className="text-gray-300 text-lg tracking-wide">
            SYSTEM ADMINISTRATION PANEL
          </p>
        </div>

        {/* Stats Dashboard */}
        <EvolvedStats />

        {/* Admin Controls */}
        <AdminSection />
      </main>
    </div>
  );
}