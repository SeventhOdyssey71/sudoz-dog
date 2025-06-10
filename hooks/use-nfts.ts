'use client';

import { useState, useEffect } from 'react';
import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { CONTRACT_CONSTANTS } from '@/constants/contract';

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

export function useNFTs() {
  const [artifacts, setArtifacts] = useState<NFTData[]>([]);
  const [evolvedNFTs, setEvolvedNFTs] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const client = useSuiClient();
  const account = useCurrentAccount();

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
      setLoading(true);
      setError(null);

      // Fetch SUDOZ Artifacts
      const artifactsResponse = await client.getOwnedObjects({
        owner: account.address,
        filter: {
          StructType: CONTRACT_CONSTANTS.TYPES.SUDOZ_ARTIFACT,
        },
        options: {
          showContent: true,
          showDisplay: true,
        },
      });

      // Fetch Evolved SUDOZ
      const evolvedResponse = await client.getOwnedObjects({
        owner: account.address,
        filter: {
          StructType: CONTRACT_CONSTANTS.TYPES.EVOLVED_SUDOZ,
        },
        options: {
          showContent: true,
          showDisplay: true,
        },
      });

      // Parse artifacts
      const parsedArtifacts: NFTData[] = artifactsResponse.data
        .map((nft) => {
          if (!nft.data?.content || nft.data.content.dataType !== 'moveObject') {
            return null;
          }

          const content = nft.data.content.fields as any;
          const display = nft.data.display?.data || {};
          
          let imageUrl = display.image_url || content.image_url || '';
          
          // Convert IPFS URLs to HTTP gateway URLs
          if (imageUrl.startsWith('ipfs://')) {
            const ipfsHash = imageUrl.replace('ipfs://', '');
            imageUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
          }

          return {
            objectId: nft.data.objectId,
            name: display.name || content.name || 'SUDOZ ARTIFACT',
            description: display.description || content.description || '',
            imageUrl,
            level: parseInt(content.level || '0'),
            points: parseInt(content.points || '0'),
            path: content.path ? parseInt(content.path) : undefined,
            number: parseInt(content.number || '0'),
            type: 'artifact' as const,
          };
        })
        .filter((nft): nft is NFTData => nft !== null);

      // Parse evolved NFTs
      const parsedEvolved: NFTData[] = evolvedResponse.data
        .map((nft) => {
          if (!nft.data?.content || nft.data.content.dataType !== 'moveObject') {
            return null;
          }

          const content = nft.data.content.fields as any;
          const display = nft.data.display?.data || {};
          
          let imageUrl = display.image_url || content.image_url || '';
          
          // Convert IPFS URLs to HTTP gateway URLs
          if (imageUrl.startsWith('ipfs://')) {
            const ipfsHash = imageUrl.replace('ipfs://', '');
            imageUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
          }

          return {
            objectId: nft.data.objectId,
            name: display.name || content.name || 'Evolved SUDOZ',
            description: display.description || content.description || '',
            imageUrl,
            level: 10, // Evolved NFTs are considered max level
            points: 12, // Max points for evolved
            path: content.original_path ? parseInt(content.original_path) : undefined,
            number: parseInt(content.number || '0'),
            type: 'evolved' as const,
          };
        })
        .filter((nft): nft is NFTData => nft !== null);

      setArtifacts(parsedArtifacts);
      setEvolvedNFTs(parsedEvolved);
    } catch (err) {
      console.error('Error fetching NFTs:', err);
      setError('Failed to fetch NFTs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, [account?.address, client]);

  // Listen for NFT updates
  useEffect(() => {
    const handleNFTUpdate = () => {
      fetchNFTs();
    };

    window.addEventListener('nft-updated', handleNFTUpdate);
    return () => {
      window.removeEventListener('nft-updated', handleNFTUpdate);
    };
  }, []);

  return {
    artifacts,
    evolvedNFTs,
    loading,
    error,
    refetch: fetchNFTs,
  };
}