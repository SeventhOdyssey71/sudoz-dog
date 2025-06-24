"use client"

import { Flame, Trophy, Users, Star, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { useNFTs } from '@/hooks/use-nfts'
import Image from 'next/image'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const mockStats = [
  { icon: <Trophy className="w-8 h-8 mb-2 text-red-300" />, value: '156', label: 'SUDOZ Spots Claimed' },
  { icon: <Users className="w-8 h-8 mb-2 text-red-300" />, value: '1,560', label: 'Artifacts Burned' },
  { icon: <Star className="w-8 h-8 mb-2 text-red-300" />, value: '42', label: 'Spots Available' },
]

export default function BurnPage() {
  const account = useCurrentAccount()
  const { nfts, isLoading } = useNFTs()
  const [selectedArtifacts, setSelectedArtifacts] = useState<string[]>([])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isBurning, setIsBurning] = useState(false)
  const [burnedSpots, setBurnedSpots] = useState<any[]>([])

  // Filter only artifacts (not evolved SUDOZ)
  const artifacts = nfts.filter(nft => 
    nft.name?.includes('Artifact') || 
    (nft.level && nft.level < 10)
  )

  const toggleArtifactSelection = (nftId: string) => {
    setSelectedArtifacts(prev => {
      if (prev.includes(nftId)) {
        return prev.filter(id => id !== nftId)
      }
      if (prev.length >= 10) {
        toast.error('You can only select up to 10 artifacts')
        return prev
      }
      return [...prev, nftId]
    })
  }

  const handleBurnArtifacts = async () => {
    if (selectedArtifacts.length !== 10) {
      toast.error('Please select exactly 10 artifacts to burn')
      return
    }

    setShowConfirmDialog(true)
  }

  const confirmBurn = async () => {
    setIsBurning(true)
    setShowConfirmDialog(false)

    try {
      // TODO: Implement actual burn transaction
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate transaction
      
      toast.success('Successfully burned 10 artifacts! You have earned 1 SUDOZ spot.')
      
      // Add to burned spots
      setBurnedSpots(prev => [...prev, {
        id: Date.now(),
        artifactsBurned: selectedArtifacts.length,
        timestamp: new Date().toISOString(),
        claimed: false
      }])
      
      setSelectedArtifacts([])
    } catch (error) {
      toast.error('Failed to burn artifacts. Please try again.')
    } finally {
      setIsBurning(false)
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-2/3 left-2/3 w-60 h-60 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Back button */}
        <Link href="/vault" className="inline-flex items-center text-red-400 hover:text-red-300 mb-8">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Vault
        </Link>

        {/* Hero Section */}
        <div className="flex flex-col items-center mb-12">
          <div className="rounded-full bg-red-900/60 border-4 border-red-400/30 p-6 mb-4 shadow-lg shadow-red-500/20">
            <Flame className="w-16 h-16 text-red-400 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-red-400 mb-4 tracking-wider text-center">
            Sacrifice System
          </h1>
          <p className="text-lg md:text-xl text-gray-300 text-center max-w-2xl">
            Burn 10 Artifacts to earn a SUDOZ spot. High risk, high reward!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {mockStats.map((stat, i) => (
            <div key={i} className="bg-red-900/20 border border-red-400/20 rounded-xl p-6 text-center backdrop-blur-sm">
              {stat.icon}
              <div className="text-3xl font-bold text-red-400">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="burn" className="w-full">
          <TabsList className="grid w-full md:w-[400px] mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="burn">Burn Artifacts</TabsTrigger>
            <TabsTrigger value="spots">My SUDOZ Spots</TabsTrigger>
          </TabsList>

          <TabsContent value="burn">
            <Card className="bg-gray-900/50 border-red-400/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-red-400">Burn 10 Artifacts for 1 SUDOZ Spot</CardTitle>
                <CardDescription className="text-gray-400">
                  Select exactly 10 artifacts to burn. Once burned, they cannot be recovered.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!account ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-4">Please connect your wallet to view your artifacts</p>
                  </div>
                ) : isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400 mx-auto"></div>
                    <p className="text-gray-400 mt-4">Loading your artifacts...</p>
                  </div>
                ) : artifacts.length === 0 ? (
                  <div className="text-center py-12">
                    <XCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-300">You don't have any artifacts to burn</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        Selected: <span className="text-red-400 font-bold">{selectedArtifacts.length}/10</span>
                      </div>
                      {selectedArtifacts.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedArtifacts([])}
                          className="text-gray-400 hover:text-red-400"
                        >
                          Clear Selection
                        </Button>
                      )}
                    </div>

                    <ScrollArea className="h-[400px] pr-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {artifacts.map((nft) => {
                          const isSelected = selectedArtifacts.includes(nft.id)
                          return (
                            <div
                              key={nft.id}
                              onClick={() => toggleArtifactSelection(nft.id)}
                              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                isSelected
                                  ? 'border-red-400 shadow-lg shadow-red-400/30'
                                  : 'border-gray-700 hover:border-red-400/50'
                              }`}
                            >
                              <div className="aspect-square relative">
                                <Image
                                  src={nft.imageUrl}
                                  alt={nft.name}
                                  fill
                                  className="object-cover"
                                />
                                {isSelected && (
                                  <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                                    <CheckCircle className="w-12 h-12 text-white" />
                                  </div>
                                )}
                              </div>
                              <div className="p-2 bg-gray-900">
                                <p className="text-xs text-gray-300 truncate">{nft.name}</p>
                                {nft.level && (
                                  <Badge variant="outline" className="text-xs mt-1">
                                    Level {nft.level}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </ScrollArea>

                    <div className="mt-6">
                      <Button
                        onClick={handleBurnArtifacts}
                        disabled={selectedArtifacts.length !== 10 || isBurning}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3"
                      >
                        {isBurning ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Burning Artifacts...
                          </>
                        ) : (
                          <>
                            <Flame className="w-5 h-5 mr-2" />
                            Burn 10 Artifacts for SUDOZ Spot
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="spots">
            <Card className="bg-gray-900/50 border-red-400/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-red-400">Your SUDOZ Spots</CardTitle>
                <CardDescription className="text-gray-400">
                  View and claim your earned SUDOZ spots from burned artifacts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {burnedSpots.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-300">You haven't earned any SUDOZ spots yet</p>
                    <p className="text-gray-500 text-sm mt-2">Burn 10 artifacts to earn your first spot!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {burnedSpots.map((spot) => (
                      <div key={spot.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-red-400 font-semibold">1 SUDOZ Spot</p>
                            <p className="text-sm text-gray-400">
                              Earned on {new Date(spot.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant={spot.claimed ? "outline" : "default"}
                            disabled={spot.claimed}
                            className={spot.claimed ? "text-gray-500" : "bg-red-500 hover:bg-red-600"}
                          >
                            {spot.claimed ? "Claimed" : "Claim Later"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card className="bg-gray-900/50 border-yellow-400/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-300">
              <p>• Select exactly 10 artifacts from your collection</p>
              <p>• Burn them permanently to earn 1 SUDOZ spot</p>
              <p>• SUDOZ spots can be claimed later when available</p>
              <p>• Each spot guarantees you 1 SUDOZ NFT</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-red-400/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center">
                <Flame className="w-5 h-5 mr-2" />
                Important Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-300">
              <p>• Burned artifacts are permanently destroyed</p>
              <p>• This action cannot be undone</p>
              <p>• Make sure to select artifacts you want to sacrifice</p>
              <p>• SUDOZ spots are limited - burn wisely!</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-gray-900 border-red-400/20">
          <DialogHeader>
            <DialogTitle className="text-red-400 text-xl">Confirm Artifact Burn</DialogTitle>
            <DialogDescription className="text-gray-300">
              You are about to burn 10 artifacts permanently. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-900/20 border border-red-400/20 rounded-lg p-4">
              <p className="text-sm text-gray-300 mb-2">You will receive:</p>
              <p className="text-lg font-bold text-red-400">1 SUDOZ Spot</p>
              <p className="text-xs text-gray-400 mt-1">(Claimable when SUDOZ NFTs are available)</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmBurn}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Confirm Burn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}