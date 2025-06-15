'use client';

import { useState, useEffect } from 'react';
import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { CONTRACT_CONSTANTS } from '@/constants/contract';
import { getUserKiosks } from '@/utils/kioskUtils';

// BlockVision API Key (optional - we'll use direct methods if it fails)
const BLOCKVISION_API_KEY = process.env.NEXT_PUBLIC_BLOCKVISION_API_KEY || '';

export interface NFTData {
  objectId: string;
  name: string;
  description: string;
  imageUrl: string;
  level: number;
  points: number;
  path?: number;
  number: number;
  type: 'artifact' | 'evolved';
}

// Simple in-memory cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute cache

// Request deduplication to prevent multiple simultaneous requests
const pendingRequests = new Map<string, Promise<any>>();

export function useNFTs() {
  const [artifacts, setArtifacts] = useState<NFTData[]>([]);
  const [evolvedNFTs, setEvolvedNFTs] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefetching, setIsRefetching] = useState(false);
  
  const client = useSuiClient();
  const account = useCurrentAccount();

  // Fetch NFTs using BlockVision API v1 (legacy)
  const fetchNFTDataForWallet = async (walletAddress: string) => {
    try {
      const myHeaders = new Headers();
      if (BLOCKVISION_API_KEY) {
        myHeaders.append("X-API-KEY", BLOCKVISION_API_KEY);
      }
      myHeaders.append("Content-Type", "application/json");

      // Use the correct endpoint for Sui NFTs
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };

      // Try the correct endpoint format for BlockVision Sui API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(
        `https://api.blockvision.org/v1/sui/mainnet/account/${walletAddress}/nfts?limit=100`,
        {
          ...requestOptions,
          signal: controller.signal,
        }
      );
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        // If BlockVision fails, return null to use fallback
        console.warn(`BlockVision API returned ${response.status}, using fallback methods`);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn("BlockVision API not available, using fallback:", error);
      return null;
    }
  };

  // Fetch evolved NFTs ONLY from kiosks using BlockVision v2 API
  const fetchEvolvedNFTsWithKiosk = async (walletAddress: string) => {
    const requestKey = `evolved-kiosk-${walletAddress}`;
    
    // Check if there's already a pending request
    const pendingRequest = pendingRequests.get(requestKey);
    if (pendingRequest) {
      console.log('Reusing pending request for evolved NFTs');
      return pendingRequest;
    }
    
    // Create new request
    const request = (async () => {
      console.log('Fetching evolved NFTs from kiosks for wallet:', walletAddress);
      
      try {
        // Initialize array to hold NFT objects from kiosks
        let allEvolvedNfts: any[] = [];
        
        // Check cache first
        const cacheKey = requestKey;
        const cached = apiCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          console.log('Using cached BlockVision data');
          return cached.data;
        }
      
      // Use BlockVision v2 API to fetch NFTs in kiosks
      try {
        const url = new URL('https://api.blockvision.org/v2/sui/account/nfts');
        url.searchParams.append('account', walletAddress);
        url.searchParams.append('type', 'kiosk'); // Specifically request kiosk NFTs
        url.searchParams.append('pageIndex', '1');
        url.searchParams.append('pageSize', '100'); // Increased page size
        
        const headers: any = {
          'accept': 'application/json'
        };
        
        if (BLOCKVISION_API_KEY) {
          headers['x-api-key'] = BLOCKVISION_API_KEY;
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for faster fallback
        
        const response = await fetch(url.toString(), { 
          headers,
          signal: controller.signal 
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const result = await response.json();
          
          if (result.code === 200) {
            const nfts = result.result?.data || [];
            console.log(`BlockVision v2: Found ${nfts.length} total NFTs in kiosks`);
            
            // Filter for evolved SUDOZ NFTs
            const evolvedKioskNfts = nfts.filter((nft: any) => 
              nft.collection && (
                nft.collection === CONTRACT_CONSTANTS.TYPES.EVOLVED_SUDOZ ||
                nft.collection.includes('evolved_sudoz') ||
                nft.collection.includes('EvolvedSudoz') ||
                nft.collection.includes(CONTRACT_CONSTANTS.PACKAGE_ID)
              )
            );
            
            console.log(`Found ${evolvedKioskNfts.length} evolved SUDOZ NFTs in kiosks`);
            
            // Batch fetch all NFT details in parallel for better performance
            const objectIds = evolvedKioskNfts.map(nft => nft.objectId);
            console.log(`Fetching ${objectIds.length} evolved NFTs in parallel...`);
            
            try {
              // Use multiGetObjects for batch fetching
              const objectsData = await client.multiGetObjects({
                ids: objectIds,
                options: {
                  showContent: true,
                  showDisplay: true,
                  showType: true,
                }
              });
              
              // Process the results
              objectsData.forEach((objectData, index) => {
                if (objectData.data) {
                  const kioskNft = evolvedKioskNfts[index];
                  // Add kiosk info to the object
                  objectData.data.kioskId = kioskNft.kioskId;
                  objectData.data.isInKiosk = true;
                  allEvolvedNfts.push(objectData);
                }
              });
            } catch (err) {
              console.error('Error batch fetching NFT details:', err);
              // Fallback to individual fetching if batch fails
              for (const nft of evolvedKioskNfts) {
                try {
                  const objectData = await client.getObject({
                    id: nft.objectId,
                    options: {
                      showContent: true,
                      showDisplay: true,
                      showType: true,
                    }
                  });
                  
                  if (objectData.data) {
                    objectData.data.kioskId = nft.kioskId;
                    objectData.data.isInKiosk = true;
                    allEvolvedNfts.push(objectData);
                  }
                } catch (err) {
                  console.error('Error fetching individual NFT:', err);
                }
              }
            }
          } else {
            console.error('BlockVision API returned error code:', result.code, result.message);
          }
        } else {
          console.error('BlockVision API request failed:', response.status, response.statusText);
        }
      } catch (blockVisionError) {
        console.error('BlockVision v2 API error:', blockVisionError);
        // Return empty array if API fails
        return [];
      }
      
      console.log(`Total evolved NFTs found in kiosks: ${allEvolvedNfts.length}`);
      
      // Cache the results
      if (allEvolvedNfts.length > 0) {
        apiCache.set(cacheKey, { data: allEvolvedNfts, timestamp: Date.now() });
      }
      
        return allEvolvedNfts;
        
      } catch (error) {
        console.error('Error in fetchEvolvedNFTsWithKiosk:', error);
        return [];
      }
    })();
    
    // Store the pending request
    pendingRequests.set(requestKey, request);
    
    // Clean up after completion
    request.finally(() => {
      pendingRequests.delete(requestKey);
    });
    
    return request;
  };

  const fetchNFTs = async (retryCount = 0) => {
    if (!account?.address) {
      setArtifacts([]);
      setEvolvedNFTs([]);
      setLoading(false);
      return;
    }

    if (!client) {
      if (retryCount < 3) {
        setTimeout(() => fetchNFTs(retryCount + 1), 1000);
      }
      return;
    }

    try {
      // Don't set loading to true if we're just refetching
      if (!isRefetching) {
        setLoading(true);
      }
      setError(null);

      // Execute all fetches concurrently for maximum speed
      const startTime = Date.now();
      
      const [artifactsResult, evolvedResult] = await Promise.allSettled([
        // Fetch artifacts
        client.getOwnedObjects({
          owner: account.address,
          filter: {
            StructType: CONTRACT_CONSTANTS.TYPES.SUDOZ_ARTIFACT,
          },
          options: {
            showContent: true,
            showDisplay: true,
          },
        }),
        // Fetch evolved NFTs from kiosks
        fetchEvolvedNFTsWithKiosk(account.address),
      ]);
      
      console.log(`All fetches completed in ${Date.now() - startTime}ms`);
      
      // Handle artifacts result
      let artifactsResponse;
      if (artifactsResult.status === 'rejected') {
        console.error('Failed to fetch artifacts:', artifactsResult.reason);
        if (retryCount < 3) {
          setTimeout(() => fetchNFTs(retryCount + 1), 2000);
          return;
        }
        throw new Error('Network error: Unable to connect to Sui network. Please check your connection.');
      } else {
        artifactsResponse = artifactsResult.value;
      }
      
      // Handle evolved NFTs result
      let allEvolvedNfts = [];
      if (evolvedResult.status === 'fulfilled') {
        allEvolvedNfts = evolvedResult.value;
        console.log(`Total evolved NFTs found in kiosks: ${allEvolvedNfts.length}`);
      } else {
        console.error('Failed to fetch evolved NFTs:', evolvedResult.reason);
      }
      
      // Legacy BlockVision v1 data is no longer used for evolved NFTs
      // The enhanced fetchEvolvedNFTsWithKiosk function handles all evolved NFT fetching
      // Parse artifacts with optimized processing
      const parsedArtifacts: NFTData[] = [];
      for (const nft of artifactsResponse.data) {
        if (!nft.data?.content || nft.data.content.dataType !== 'moveObject') {
          continue; // Skip invalid entries quickly
        }

        const content = nft.data.content.fields as any;
        const display = nft.data.display?.data || {};
        
        let imageUrl = display.image_url || content.image_url || '';
        
        // Quick IPFS conversion
        if (imageUrl.startsWith('ipfs://')) {
          imageUrl = `https://ipfs.io/ipfs/${imageUrl.slice(7)}`;
        }

        parsedArtifacts.push({
          objectId: nft.data.objectId,
          name: display.name || content.name || 'SUDOZ ARTIFACT',
          description: display.description || content.description || '',
          imageUrl,
          level: parseInt(content.level || '0'),
          points: parseInt(content.points || '0'),
          path: content.path !== undefined ? parseInt(content.path) : undefined,
          number: parseInt(content.number || '0'),
          type: 'artifact' as const,
        });
      }

      // allEvolvedNfts already contains all evolved NFTs from direct ownership and kiosks
      
      // Parse evolved NFTs with optimized processing
      const parsedEvolved: NFTData[] = [];
      for (const nft of allEvolvedNfts) {
        if (!nft.data?.content || nft.data.content.dataType !== 'moveObject') {
          continue; // Skip invalid entries quickly
        }

        const content = nft.data.content.fields as any;
        const display = nft.data.display?.data || {};
        
        let imageUrl = display.image_url || content.image_url || '';
        const number = content.number || content.id || '';
        
        // Quick IPFS conversion
        if (imageUrl.startsWith('ipfs://')) {
          imageUrl = `https://ipfs.io/ipfs/${imageUrl.slice(7)}`;
        }
        
        // Deterministic image URL for evolved NFTs
        if (!imageUrl || imageUrl.includes('placeholder')) {
          const identifier = number || content.metadata_id || content.metadataId || '';
          if (identifier) {
            const paddedId = identifier.toString().padStart(4, '0');
            imageUrl = `https://plum-defeated-leopon-866.mypinata.cloud/ipfs/bafybeic7kknhjbvdrrkzlthi7zvqg7ilxeeckcq3d7y54qv3xngiw2pjui/nfts/${paddedId}.png`;
          }
        }
        
        // Use fallback if still no image
        if (!imageUrl) {
          imageUrl = '/images/sudoz-purple.png';
        }
        
        parsedEvolved.push({
          objectId: nft.data.objectId,
          name: display.name || content.name || `THE SUDOZ #${number || 'Unknown'}`,
          description: display.description || content.description || '',
          imageUrl,
          level: 10,
          points: 12,
          path: content.original_path ? parseInt(content.original_path) : undefined,
          number: parseInt(number || '0'),
          type: 'evolved' as const,
        });
      }

      // Update state immediately as data becomes available
      if (parsedArtifacts.length > 0 || artifacts.length === 0) {
        setArtifacts(parsedArtifacts);
      }
      
      if (parsedEvolved.length > 0 || evolvedNFTs.length === 0) {
        setEvolvedNFTs(parsedEvolved);
      }
      
      // Log successful fetch with timing
      const totalTime = Date.now() - startTime;
      console.log('NFTs fetched successfully:', {
        artifacts: parsedArtifacts.length,
        evolved: parsedEvolved.length,
        account: account.address,
        totalTime: `${totalTime}ms`,
        avgTimePerNFT: parsedArtifacts.length + parsedEvolved.length > 0 
          ? `${Math.round(totalTime / (parsedArtifacts.length + parsedEvolved.length))}ms` 
          : 'N/A',
      });
    } catch (err: any) {
      console.error('Error fetching NFTs:', err);
      
      // Handle specific error types
      let errorMessage = 'Failed to fetch NFTs';
      
      if (err.message?.includes('Network error')) {
        errorMessage = err.message;
      } else if (err.message?.includes('Failed to fetch')) {
        errorMessage = 'Network connection error. Please check your internet connection and try again.';
      } else if (err.message?.includes('CORS')) {
        errorMessage = 'Cross-origin request blocked. Please check your network settings.';
      }
      
      // Don't show error on first load or if it's just a network hiccup
      if (!isRefetching && artifacts.length === 0 && evolvedNFTs.length === 0) {
        setError(errorMessage);
      }
      
      // If we have a network error and haven't retried too many times, retry
      if (err.message?.includes('fetch') && retryCount < 3) {
        console.log(`Retrying fetch (attempt ${retryCount + 1}/3)...`);
        setTimeout(() => fetchNFTs(retryCount + 1), 2000);
        return;
      }
    } finally {
      setLoading(false);
      setIsRefetching(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, [account?.address, client]);

  // Listen for NFT updates
  useEffect(() => {
    const handleNFTUpdate = () => {
      // Add a small delay to ensure blockchain state is updated
      setTimeout(() => {
        setIsRefetching(true);
        fetchNFTs().finally(() => setIsRefetching(false));
      }, 1000); // Increased delay for better blockchain sync
    };

    window.addEventListener('nft-updated', handleNFTUpdate);
    return () => {
      window.removeEventListener('nft-updated', handleNFTUpdate);
    };
  }, [account?.address, client]); // Add dependencies to ensure we always have latest fetchNFTs

  return {
    artifacts,
    evolvedNFTs,
    loading,
    error,
    refetch: fetchNFTs,
    isRefetching,
  };
}