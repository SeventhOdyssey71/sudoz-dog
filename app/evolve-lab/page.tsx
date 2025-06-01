"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowLeft, Wallet, Zap, Flame, Dna, Scan, Activity, AlertTriangle, CheckCircle, ArrowUpCircle } from "lucide-react"
import Image from "next/image"
import WalletConnect from "../components/WalletConnect"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { useSuiClient } from '@mysten/dapp-kit'
import { SuiClient } from '@mysten/sui.js/client'

export default function EvolveLab() {
  const account = useCurrentAccount();
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [pendingMutations, setPendingMutations] = useState(0)

  const suiClient = useSuiClient();
  const [artifactNFT, setArtifactNFT] = useState<any>(null);
  const [isFetchingNFT, setIsFetchingNFT] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const targetNFTType = "0xd44eeba23c7256b426113b5b645638f00abc0f27ec224f7286be6f9853df8a5a::_sudoz_artifacts::Nft";

  useEffect(() => {
    if (!account) {
      setArtifactNFT(null);
      setIsFetchingNFT(false);
      setFetchError(null);
      return;
    }

    const fetchNFT = async () => {
      setIsFetchingNFT(true);
      setFetchError(null);
      try {
        const ownedObjects = await suiClient.getOwnedObjects({
          owner: account.address,
          filter: {
            StructType: "0xd44eeba23c7256b426113b5b645638f00abc0f27ec224f7286be6f9853df8a5a::_sudoz_artifacts::Nft",
          },
          options: {
            showDisplay: true,
            showContent: true,
          },
        });

        if (ownedObjects.data.length > 0) {
          // Assuming you want to display the first one found
          setArtifactNFT(ownedObjects.data[0]);
        } else {
          setArtifactNFT(null);
        }
      } catch (e: any) {
        console.error("Error fetching NFT:", e);
        setFetchError("Failed to fetch NFT.");
        setArtifactNFT(null);
      } finally {
        setIsFetchingNFT(false);
      }
    };

    fetchNFT();

  }, [account, suiClient]); // Refetch when account or client changes

  // Timer State and Logic
  const TWENTY_FOUR_HOURS_IN_SECONDS = 24 * 60 * 60;
  const [timeLeft, setTimeLeft] = useState(TWENTY_FOUR_HOURS_IN_SECONDS);

  useEffect(() => {
    // Exit early if countdown is finished
    if (timeLeft <= 0) return;

    // Save intervalId to clear it later
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // Clear interval on re-render or component unmount
    return () => clearInterval(intervalId);
  }, [timeLeft]); // Re-run effect if timeLeft changes

  // Format time left to HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Function to get the correct image based on level
  const getArtifactImage = (level: number) => {
    if (level >= 10) return "/images/level-10.png"
    if (level >= 9) return "/images/level-09.png"
    if (level >= 8) return "/images/level-08.png"
    if (level >= 7) return "/images/level-07.png"
    if (level >= 6) return "/images/level-06.png"
    if (level >= 5) return "/images/level-05.png"
    if (level >= 4) return "/images/level-04.png"
    if (level >= 3) return "/images/level-03.png"
    if (level >= 2) return "/images/level-02.png"
    return "/images/level-01.png"
  }

  // Function to get evolution stage description
  const getEvolutionStage = (level: number) => {
    if (level >= 10) return { name: "ENTITY", color: "text-red-400", description: "MAXIMUM EVOLUTION REACHED" }
    if (level >= 8) return { name: "UNSTABLE", color: "text-orange-400", description: "APPROACHING CRITICAL THRESHOLD" }
    if (level >= 6) return { name: "SHADOW", color: "text-purple-400", description: "DARK TRANSFORMATION ACTIVE" }
    if (level >= 4) return { name: "MYSTERIOUS", color: "text-blue-400", description: "GENETIC ANOMALIES DETECTED" }
    if (level >= 2) return { name: "ENHANCED", color: "text-green-400", description: "EVOLUTION IN PROGRESS" }
    return { name: "PURE", color: "text-cyan-400", description: "ORIGINAL GENETIC STATE" }
  }

  // Mock artifact data - single artifact
  const artifact = {
    id: 1337,
    name: "MY SUDOZ DOG",
    level: 0,
    maxLevel: 10,
    currentValue: 0,
    rarity: 4,
    dnaSequence: "DNA97/2309/57A2",
    traitModules: ["ALPHA", "BETA", "GAMMA"],
    mutationProbability: 87,
    attributes: ["Green", "Rare", "Evolved"],
  }

  const [selectedArtifact, setSelectedArtifact] = useState(artifact)

  const loadingMessages = [
    "Initializing Artifact DNA…",
    "Connecting to SUDOZ Lab Nodes…",
    "Reading Genetic Memory…",
    "Injecting Catalyst…",
    "Trait Module Detected…",
    "Mutation Probability Calculating…",
    "Genetic Structure Analyzing…",
    "Evolution Sequence Activated…",
  ]

  const successMessages = [
    "Level Up Complete – New Trait Acquired",
    "Mutation Successful – Artifact Enhanced",
    "DNA Structure Enhanced – Trait Unlocked",
    "Genetic Evolution Successful",
    "Trait Module Successfully Integrated",
  ]

  const handleStartEvolution = () => {
    if (selectedArtifact.level < selectedArtifact.maxLevel) {
      setIsLoading(true);
      let messageIndex = 0;
      const messageInterval = setInterval(() => {
        if (messageIndex < loadingMessages.length) {
          setLoadingMessage(loadingMessages[messageIndex]);
          messageIndex++;
        }
      }, 800);
      setTimeout(() => {
        clearInterval(messageInterval);
        setIsLoading(false);
        const updatedArtifact = {
          ...selectedArtifact,
          level: Math.min(selectedArtifact.level + 1, selectedArtifact.maxLevel),
          currentValue: selectedArtifact.currentValue + 2,
          rarity: selectedArtifact.rarity + 1,
          mutationProbability: Math.floor(Math.random() * 100) + 1,
        };
        setSelectedArtifact(updatedArtifact);
        const randomSuccess = successMessages[Math.floor(Math.random() * successMessages.length)];
        setSuccessMessage(`${randomSuccess} – Artifact Now Level ${updatedArtifact.level}`);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
      }, 6000);
    }
  };

  const handleScanArtifact = () => {
    setIsLoading(true)
    setLoadingMessage("Scanning Artifact DNA Structure…")

    setTimeout(() => {
      setIsLoading(false)
      setSuccessMessage("Artifact Scan Complete – All Systems Nominal")
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 2000)
  }

  const handleBurnSystem = () => {
    setIsLoading(true)
    setLoadingMessage("Activating Burn System…")
    setTimeout(() => {
      setIsLoading(false)
      setSuccessMessage("Artifact Burned – Entered Special Event!")
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 4000)
    }, 3000)
  }

  const handleMaxLevelUpgrade = () => {
    setIsLoading(true)
    setLoadingMessage("Upgrading to Max Level…")
    setTimeout(() => {
      setIsLoading(false)
      setSelectedArtifact({ ...selectedArtifact, level: selectedArtifact.maxLevel })
      setSuccessMessage("Artifact Upgraded to Max Level (10) Instantly!")
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 4000)
    }, 3000)
  }

  const currentStage = getEvolutionStage(selectedArtifact.level)
  const currentImage = getArtifactImage(selectedArtifact.level)

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Moving animated background blurs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/15 rounded-full blur-3xl moving-blur-1"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl moving-blur-2"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-300/8 rounded-full blur-3xl moving-blur-3"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white tracking-wide">
                <ArrowLeft className="w-4 h-4 mr-2" />
                BACK
              </Button>
            </Link>
          </div>

          <div className="flex items-center">
            {!account ? (
              <WalletConnect />
            ) : (
              <WalletConnect />
            )}
          </div>
        </header>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin mb-4 mx-auto"></div>
              <div className="text-green-400 text-lg font-bold tracking-wider mb-2">{loadingMessage}</div>
              <Progress value={33} className="w-64 mx-auto" />
            </div>
          </div>
        )}

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-green-400/20 border border-green-400/40 rounded-xl p-4 flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-bold tracking-wide">{successMessage}</span>
            </div>
          </div>
        )}

        <main className="relative z-10 container mx-auto px-6 py-8">
          {!account ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
                <Wallet className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 tracking-wider">LABORATORY ACCESS REQUIRED</h2>
              <p className="text-gray-400 mb-8 max-w-md">
                Connect your wallet to access the SUDOZ DNA Laboratory and begin genetic evolution protocols.
              </p>
              <WalletConnect />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Main Title */}
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-white mb-4 tracking-wider">EVOLVE YOUR ARTIFACT</h1>
                <p className="text-gray-300 text-lg tracking-wide">LEVEL PROTOCOL INTERFACE</p>
              </div>

              {/* Experimental Chamber and Genetic Upgrade Console */}
              <div className="max-w-2xl mx-auto space-y-8">
                <Card className="bg-gray-900/80 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-yellow-400 tracking-wider flex items-center justify-center">
                      <Activity className="w-5 h-5 mr-2" />
                      GENETIC UPGRADE CONSOLE
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedArtifact.level >= selectedArtifact.maxLevel ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-red-400/10 border border-red-400/30 rounded-xl flex items-center space-x-3">
                          <AlertTriangle className="w-6 h-6 text-red-400" />
                          <div>
                            <div className="text-red-400 font-bold tracking-wide">
                              WARNING: UNSTABLE EVOLUTION THRESHOLD
                            </div>
                            <div className="text-gray-400 text-sm">
                              Artifact has reached maximum evolution capacity
                            </div>
                          </div>
                        </div>

                        <div className="text-center space-y-4">
                          <p className="text-yellow-400 font-bold tracking-wide">
                            LEVEL 11: ARTIFACT WILL BURN AND REBIRTH WILL BEGIN
                          </p>
                          <p className="text-gray-300">You are about to unlock a SUDOZ Entity</p>

                          <Button
                            variant="outline"
                            size="lg"
                            className="border-red-400/50 text-red-400 hover:bg-red-400/10 hover:border-red-400 px-8 py-4 rounded-xl font-bold tracking-wider"
                          >
                            <Flame className="w-5 h-5 mr-2" />
                            TRIGGER REBIRTH PROTOCOL
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={handleStartEvolution}
                                disabled={isLoading || selectedArtifact.level >= selectedArtifact.maxLevel || timeLeft > 0 || !artifactNFT}
                                size="lg"
                                className="bg-green-400 hover:bg-green-500 text-black px-6 py-4 rounded-xl font-bold tracking-wider"
                              >
                                <Zap className="w-5 h-5 mr-2" />
                                START EVOLUTION
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Evolution costs 1 SUI per level</p>
                              <p>Each level grants a new mysterious trait</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={handleBurnSystem}
                                disabled={isLoading || timeLeft > 0 || !artifactNFT}
                                variant="outline"
                                size="lg"
                                className="border-red-400/50 text-red-400 hover:bg-red-400/10 px-6 py-4 rounded-xl font-bold tracking-wider"
                              >
                                <Flame className="w-5 h-5 mr-2" />
                                BURN SYSTEM
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Burn your artifact for a chance at special rewards or events</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        <div className="flex justify-center mt-4">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={handleMaxLevelUpgrade}
                                disabled={isLoading || timeLeft > 0 || !artifactNFT}
                                variant="outline"
                                size="lg"
                                className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 px-6 py-4 rounded-xl font-bold tracking-wider"
                              >
                                <ArrowUpCircle className="w-5 h-5 mr-2" />
                                INSTANT MAX LEVEL UPGRADE
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Instantly upgrades artifact to level 10 for demo purposes.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        <div className="text-center text-sm text-gray-400 space-y-1">
                          <p>• Artifacts can evolve up to level 10</p>
                          <p>• Each level grants a new mysterious trait</p>
                          <p>• Evolution costs 1 SUI per level</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/80 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-yellow-400 tracking-wider flex items-center justify-center">
                      <Activity className="w-5 h-5 mr-2" />
                      ARTIFACT DISPLAY
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 text-center">
                    {isFetchingNFT ? (
                      <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                        <div className="w-10 h-10 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin mb-2"></div>
                        Fetching Artifact...
                      </div>
                    ) : fetchError ? (
                      <div className="flex items-center justify-center h-48 text-red-400 text-center">
                        Error: {fetchError}
                      </div>
                    ) : artifactNFT ? (
                      <div className="flex flex-col items-center justify-center h-48">
                        <div className="relative w-40 h-40 md:w-48 md:h-48 mb-4">
                          <Image
                            src={artifactNFT.data?.display?.data?.image_url || "/placeholder.svg"}
                            alt={artifactNFT.data?.display?.data?.name || "Artifact NFT"}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-center space-y-4">
                        <Dna className="w-10 h-10 text-gray-400" />
                        <p>No NFT found here</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </TooltipProvider>
  )
}
