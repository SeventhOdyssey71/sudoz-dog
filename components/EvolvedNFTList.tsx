'use client';

import { useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useNFTs } from '@/hooks/use-nfts';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ExternalLink, Loader2 } from 'lucide-react';
import { CONTRACT_CONSTANTS } from '@/constants/contract';

export function EvolvedNFTList() {
  const account = useCurrentAccount();
  const { evolvedNFTs, loading, error, refetch } = useNFTs();

  // Listen for NFT update events
  useEffect(() => {
    const handleUpdate = () => {
      console.log('EvolvedNFTList: Received nft-updated event, refetching...');
      refetch();
    };

    window.addEventListener('nft-updated', handleUpdate);
    return () => window.removeEventListener('nft-updated', handleUpdate);
  }, [refetch]);

  if (!account) {
    return null;
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading evolved NFTs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Error loading evolved NFTs: {error}</p>
      </div>
    );
  }

  console.log('EvolvedNFTList - Total evolved NFTs:', evolvedNFTs.length);
  console.log('Package ID:', CONTRACT_CONSTANTS.PACKAGE_ID);
  console.log('Evolved Type:', CONTRACT_CONSTANTS.TYPES.EVOLVED_SUDOZ);

  if (evolvedNFTs.length === 0) {
    return (
      <div className="mb-8">
        <Card className="bg-black/50 border-purple-400/30">
          <CardContent className="p-8 text-center">
            <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <p className="text-gray-400">No evolved NFTs yet. Evolve a level 10 artifact to get one!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {evolvedNFTs.map((nft) => {
          const objectId = nft.objectId;
          
          const name = nft.name;
          const imageUrl = nft.imageUrl;
          const number = nft.number;
          const path = nft.path;
          
          console.log('Displaying evolved NFT:', {
            objectId,
            name,
            number,
            imageUrl
          });
          
          return (
            <Card key={objectId} className="bg-black/80 border-purple-400/50 hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:shadow-purple-400/20 overflow-hidden">
              <div className="aspect-square bg-gray-900/50 relative">
                <a 
                  href={`https://suivision.xyz/object/${objectId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={name}
                      className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        // Try PNG version as fallback
                        target.src = imageUrl.replace('.webp', '.png');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Sparkles className="w-16 h-16" />
                    </div>
                  )}
                </a>
                <Badge className="absolute top-3 right-3 bg-purple-400 text-black font-bold">
                  EVOLVED
                </Badge>
                <a 
                  href={`https://suivision.xyz/object/${objectId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 bg-black/80 p-2 rounded-lg hover:bg-black transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-purple-400" />
                </a>
              </div>
              
              <CardContent className="p-6">
                <h3 className="font-bold text-xl text-white mb-2">{name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Number:</span>
                    <span className="text-purple-400 font-bold">#{number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Level:</span>
                    <span className="text-purple-400">MAX</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Points:</span>
                    <span className="text-purple-400">{nft.points}</span>
                  </div>
                  {path !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Heritage:</span>
                      <span className="text-green-400 text-xs">
                        {CONTRACT_CONSTANTS.PATHS[path]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-400 text-center">
                    Rare evolved NFT obtained by burning a level 10 artifact
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}