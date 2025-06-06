"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle, ArrowLeft, ArrowRight, Beaker, CheckCircle, Dna, Eye, Flame, FlaskConical, Scan, Activity, ArrowUpCircle, Wallet, Zap, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import WalletConnect from "../components/WalletConnect";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSuiClient } from "@mysten/dapp-kit";
import { SuiClient } from "@mysten/sui.js/client";

// Define interfaces for NFT data structure
interface NFTDisplay {
  name?: string;
  description?: string;
  image_url?: string;
  image?: string; // Support both image and image_url properties
}

interface NFTData {
  objectId?: string;
  display?: NFTDisplay;
  content?: any;
  kioskId?: string;
  isInKiosk?: boolean;
  type?: string;
}

interface NFTObject {
  data?: NFTData;
}

export default function EvolveLab() {
  const account = useCurrentAccount();
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [pendingMutations, setPendingMutations] = useState(0)

  const suiClient = useSuiClient();
  const [artifactNFT, setArtifactNFT] = useState<NFTObject | null>(null);
  const [artifactNFTs, setArtifactNFTs] = useState<NFTObject[]>([]);
  const [isFetchingNFT, setIsFetchingNFT] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Target NFT type to filter for - using the same values from the test script
  const targetNFTType = "0xd44eeba23c7256b426113b5b645638f00abc0f27ec224f7286be6f9853df8a5a::_sudoz_artifacts::Nft";
  const targetPackageId = "0xd44eeba23c7256b426113b5b645638f00abc0f27ec224f7286be6f9853df8a5a";
  
  // Kiosk-related constants
  const KIOSK_MODULE = "0x2::kiosk";
  const KIOSK_TYPE = `${KIOSK_MODULE}::Kiosk`;
  const KIOSK_OWNER_CAP_TYPE = `${KIOSK_MODULE}::KioskOwnerCap`;
  const KIOSK_ITEM_TYPE = `${KIOSK_MODULE}::Item`;
  const LISTING_TYPE = `${KIOSK_MODULE}::Listing`;
  
  // BlockVision API Key
  const BLOCKVISION_API_KEY = '2vmcIQeMF5JdhEXyuyQ8n79UNoO';

  // Enhanced function to fetch NFT data for a wallet address using BlockVision API
  // This includes both directly owned NFTs and NFTs stored in kiosks
  const fetchNFTDataForWallet = async (walletAddress: string): Promise<NFTObject[]> => {
    console.log('Fetching NFTs for wallet:', walletAddress);
    console.log('Target NFT type:', targetNFTType);
    console.log('Target package ID:', targetPackageId);
    
    try {
      // First try with BlockVision API to get kiosk NFTs
      console.log(`Fetching NFTs for wallet ${walletAddress} using BlockVision API...`);
      
      // Initialize array to hold NFT objects from all sources
      let nftObjects: NFTObject[] = [];
      
      try {
        // Construct URL with parameters
        const url = new URL('https://api.blockvision.org/v2/sui/account/nfts');
        url.searchParams.append('account', walletAddress);
        url.searchParams.append('type', 'kiosk'); // Specifically request kiosk NFTs
        url.searchParams.append('pageIndex', '1');
        url.searchParams.append('pageSize', '50');
        
        const headers = {
          'accept': 'application/json',
          'x-api-key': BLOCKVISION_API_KEY
        };
        
        const response = await fetch(url.toString(), { headers });
        
        if (!response.ok) {
          throw new Error(`BlockVision API error: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.code !== 200) {
          throw new Error(`BlockVision API error: ${result.message}`);
        }
        
        const nfts = result.result.data || [];
        console.log(`Found ${nfts.length} NFTs in kiosks via BlockVision API`);
        
        // Filter for SUDOZ NFTs
        const sudozNfts = nfts.filter((nft: any) => 
          nft.collection && (
            nft.collection === targetNFTType ||
            nft.collection.toLowerCase().includes('sudoz') ||
            nft.collection.toLowerCase().includes('_sudoz_')
          )
        );
        
        console.log(`Found ${sudozNfts.length} SUDOZ NFTs in kiosks`);
        
        // Convert to NFTObject format
        nftObjects = sudozNfts.map((nft: any) => ({
          data: {
            objectId: nft.objectId,
            type: nft.collection,
            display: {
              name: nft.name || 'Sudoz Artifacts',
              image_url: nft.image || '',
              description: nft.description || ''
            },
            content: {
              fields: {
                name: nft.name || 'Sudoz Artifacts',
                description: nft.description || ''
              }
            },
            kioskId: nft.kioskId,
            isInKiosk: true
          }
        }));
      } catch (blockVisionError) {
        console.error('Error fetching from BlockVision API:', blockVisionError);
        // Continue with other methods if BlockVision fails
      }
      
      // Also try with exact type match for directly owned NFTs
      console.log('Fetching directly owned NFTs with exact type match...');
      let directNFTs: NFTObject[] = [];
      
      try {
        const ownedObjects = await suiClient.getOwnedObjects({
          owner: walletAddress,
          filter: { StructType: targetNFTType },
          options: { showDisplay: true, showContent: true, showType: true },
        });
        
        console.log(`Found ${ownedObjects.data?.length || 0} directly owned NFTs with exact type match`);
        directNFTs = [...(ownedObjects.data || [])];
      } catch (directFetchError) {
        console.error('Error fetching directly owned NFTs:', directFetchError);
      }
      
      // Try with fallback using package ID for more flexible matching if no exact matches found
      if (directNFTs.length === 0) {
        console.log('No exact matches found, trying with package ID...');
        try {
          const fallbackObjects = await suiClient.getOwnedObjects({
            owner: walletAddress,
            options: { showDisplay: true, showContent: true, showType: true },
          });
          
          const filteredObjects = (fallbackObjects.data || []).filter((obj: NFTObject) => {
            const objType = obj.data?.type;
            return objType && (
              objType === targetNFTType || 
              objType.includes('_sudoz_artifacts::Nft') || 
              objType.includes(targetPackageId)
            );
          });
          
          console.log(`Found ${filteredObjects.length} directly owned NFTs with package ID match`);
          directNFTs = filteredObjects;
        } catch (fallbackError) {
          console.error('Error in fallback NFT search:', fallbackError);
        }
      }
      
      // Combine NFTs from BlockVision API and direct fetching
      const allNFTs = [...nftObjects, ...directNFTs];
      console.log(`Found a total of ${allNFTs.length} NFTs`);
      
      return allNFTs;
    } catch (error) {
      console.error("Error fetching NFT data:", error);
      return [];
    }
  };

  useEffect(() => {
    if (!account) {
      console.log('No wallet connected');
      setArtifactNFTs([]);
      setArtifactNFT(null);
      setIsFetchingNFT(false);
      setFetchError(null);
      return;
    }

    if (!suiClient) {
      console.log('SuiClient not available');
      setFetchError("Sui client not available. Please try again.");
      return;
    }

    console.log('Wallet connected:', account.address);
    console.log('SuiClient available:', !!suiClient);

    const fetchNFTs = async () => {
      setIsFetchingNFT(true);
      setFetchError(null);
      try {
        console.log('Starting NFT fetch for wallet:', account.address);
        
        // Use the enhanced fetchNFTDataForWallet function that includes BlockVision API
        console.log('Using enhanced NFT fetching with BlockVision API integration...');
        const nfts = await fetchNFTDataForWallet(account.address);
        
        console.log('NFT fetch complete');
        console.log(`Found a total of ${nfts.length} SUDOZ NFTs`);
        
        // Log detailed information about the NFTs found
        if (nfts.length > 0) {
          console.log('First NFT details:');
          console.log('- Object ID:', nfts[0].data?.objectId);
          console.log('- Type:', nfts[0].data?.type);
          console.log('- Name:', nfts[0].data?.display?.name);
          console.log('- In Kiosk:', nfts[0].data?.isInKiosk ? 'Yes' : 'No');
          if (nfts[0].data?.isInKiosk) {
            console.log('- Kiosk ID:', nfts[0].data?.kioskId);
          }
        }
        
        // Log the full structure of the first NFT for debugging
        console.log('NFT data structure sample:', nfts.length > 0 ? JSON.stringify(nfts[0], null, 2) : 'No NFTs found');
        
        setArtifactNFTs(nfts);
        
        // Set the first NFT as selected if available
        if (nfts.length > 0) {
          console.log('Setting first NFT as selected');
          setArtifactNFT(nfts[0]);
        } else {
          console.log('No NFTs found to select');
          setArtifactNFT(null);
        }
      } catch (e) {
        console.error("Error fetching NFTs:", e);
        setFetchError("Failed to fetch NFTs.");
        setArtifactNFTs([]);
        setArtifactNFT(null);
      } finally {
        setIsFetchingNFT(false);
      }
    };

    fetchNFTs();
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

  // Function to calculate points based on level
  const calculatePoints = (level: number) => {
    // Level 0: 2 points (base points)
    // Each level from 1-10: +1 point
    // Max points: 12 (at level 10)
    return 2 + level
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
            <WalletConnect />
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
                {isFetchingNFT && (
                  <div className="mt-4 text-yellow-400">
                    <div className="w-6 h-6 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mb-2 mx-auto"></div>
                    <p>Scanning for SUDOZ artifacts...</p>
                  </div>
                )}
                {!isFetchingNFT && fetchError && (
                  <div className="mt-4 text-red-400">
                    <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
                    <p>{fetchError}</p>
                  </div>
                )}
                {!isFetchingNFT && !fetchError && artifactNFTs.length === 0 && (
                  <div className="mt-4 text-yellow-400">
                    <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
                    <p>No SUDOZ artifacts found in your wallet.</p>
                  </div>
                )}
              </div>

              {/* Success message when NFTs are found */}
              {!isFetchingNFT && !fetchError && artifactNFTs.length > 0 && (
                <div className="mt-4 mb-6 text-green-400 text-center">
                  <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                  <p>Found {artifactNFTs.length} {artifactNFTs.length === 1 ? 'artifact' : 'artifacts'} in your wallet</p>
                </div>
              )}
              
              {/* NFT Selection when multiple NFTs are available */}
              {!isFetchingNFT && artifactNFTs.length > 1 && (
                <div className="max-w-2xl mx-auto mb-8">
                  <Card className="bg-gray-900/80 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-cyan-400 tracking-wider flex items-center justify-center">
                        <Eye className="w-5 h-5 mr-2" />
                        SELECT YOUR ARTIFACT ({artifactNFTs.length} FOUND)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {artifactNFTs.map((nft: NFTObject, index: number) => {
                          const isSelected = artifactNFT && nft.data?.objectId === artifactNFT.data?.objectId;
                          const displayData = nft.data?.display || {};
                          const name = displayData.name || `SUDOZ #${index + 1}`;
                          
                          return (
                            <div 
                              key={nft.data?.objectId || index}
                              className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'bg-green-400/20 border border-green-400/40' : 'bg-gray-800/50 border border-gray-700 hover:border-green-400/20'}`}
                              onClick={() => setArtifactNFT(nft)}
                            >
                               <div className="aspect-square bg-gray-800 rounded-md mb-2 flex items-center justify-center overflow-hidden relative">
                                {/* Always use the IPFS image as placeholder */}
                                <Image 
                                  src="https://ipfs.io/ipfs/bafkreign7kxwqlqwybqbjotl7cn7budv6fsg67xrrf7xtudradwvoscok4"
                                  alt={name} 
                                  width={100} 
                                  height={100}
                                  className="object-cover w-full h-full" 
                                />
                                
                                {/* Kiosk badge */}
                                {nft.data?.isInKiosk && (
                                  <div className="absolute top-1 right-1 bg-blue-500/80 rounded-md px-1.5 py-0.5 flex items-center space-x-1" 
                                       title={`In Kiosk: ${nft.data?.kioskId?.substring(0, 8)}...`}>
                                    <Wallet className="w-3 h-3 text-white" />
                                    <span className="text-[10px] text-white font-bold">KIOSK</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="text-center">
                                <p className="text-xs font-bold text-white truncate">{name}</p>
                                <p className="text-xs text-gray-400 truncate">ID: {nft.data?.objectId?.substring(0, 8)}...</p>
                                {nft.data?.isInKiosk && (
                                  <p className="text-xs text-blue-400">In Kiosk</p>
                                )}
                              </div>
                              
                              {isSelected && (
                                <div className="mt-1 bg-green-400 rounded-full w-4 h-4 mx-auto flex items-center justify-center">
                                  <CheckCircle className="w-3 h-3 text-black" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Experimental Chamber and Genetic Upgrade Console */}
              <div className="max-w-2xl mx-auto space-y-8">
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
                            src="https://ipfs.io/ipfs/bafkreign7kxwqlqwybqbjotl7cn7budv6fsg67xrrf7xtudradwvoscok4"
                            alt={artifactNFT.data?.display?.name || "Artifact NFT"}
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
                          <p>• Evolution costs 1 SUI per level</p>
                        </div>
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
