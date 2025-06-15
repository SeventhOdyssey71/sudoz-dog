'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { CONTRACT_CONSTANTS } from '@/constants/contract';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ExternalLink } from 'lucide-react';

export function EvolvedNFTDisplay() {
  const account = useCurrentAccount();

  const { data, isLoading, error, refetch } = useSuiClientQuery('getOwnedObjects', {
    owner: account?.address || '',
    filter: {
      StructType: CONTRACT_CONSTANTS.TYPES.EVOLVED_SUDOZ,
    },
    options: {
      showType: true,
      showOwner: true,
      showContent: true,
      showDisplay: true,
    },
  }, {
    enabled: !!account,
  });

  // Listen for NFT update events
  useEffect(() => {
    const handleUpdate = () => {
      console.log('EvolvedNFTDisplay: Received nft-updated event, refetching...');
      refetch();
    };

    window.addEventListener('nft-updated', handleUpdate);
    return () => window.removeEventListener('nft-updated', handleUpdate);
  }, [refetch]);

  if (!account) {
    return null;
  }

  const evolvedNfts = data?.data || [];

  console.log('EvolvedNFTDisplay query:', {
    type: CONTRACT_CONSTANTS.TYPES.EVOLVED_SUDOZ,
    count: evolvedNfts.length,
    data: evolvedNfts
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Loading evolved NFTs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Error loading evolved NFTs: {error.message}</p>
      </div>
    );
  }

  if (evolvedNfts.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-purple-400 mb-4">THE SUDOZ (Evolved)</h2>
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
      <h2 className="text-2xl font-bold text-purple-400 mb-4">THE SUDOZ (Evolved)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {evolvedNfts.map((nft) => {
          const contentData = nft.data?.content;
          const content: any = contentData && 'fields' in contentData ? contentData.fields : {};
          const display = nft.data?.display?.data || {};
          const objectId = nft.data?.objectId || '';
          
          const name = display.name || content.name || `THE SUDOZ #${content.number || ''}`;
          let imageUrl = display.image_url || content.image_url || '';
          const number = content.number || '';
          const metadataId = content.metadata_id || '';
          const originalArtifactNumber = content.original_artifact_number || '';
          const originalPath = content.original_path;
          
          console.log('Evolved NFT data:', {
            objectId,
            name,
            imageUrl,
            metadataId,
            content,
            display
          });
          
          // Convert IPFS URLs to HTTP gateway URLs
          if (imageUrl.startsWith('ipfs://')) {
            const ipfsHash = imageUrl.replace('ipfs://', '');
            imageUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
          }
          
          // For evolved NFTs, try multiple approaches to get the image
          if (!imageUrl || imageUrl.includes('placeholder')) {
            if (metadataId) {
              // Use PNG version which seems more reliable
              imageUrl = `https://plum-defeated-leopon-866.mypinata.cloud/ipfs/bafybeic7kknhjbvdrrkzlthi7zvqg7ilxeeckcq3d7y54qv3xngiw2pjui/nfts/${metadataId}.png`;
            } else if (number) {
              const paddedNumber = number.toString().padStart(4, '0');
              imageUrl = `https://plum-defeated-leopon-866.mypinata.cloud/ipfs/bafybeic7kknhjbvdrrkzlthi7zvqg7ilxeeckcq3d7y54qv3xngiw2pjui/nfts/${paddedNumber}.png`;
            }
          }
          
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
                    <Image
                      src={imageUrl}
                      alt={name}
                      fill
                      className="object-cover hover:opacity-90 transition-opacity"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      unoptimized
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        // Try different extensions as fallback
                        if (imageUrl.includes('.png')) {
                          target.src = imageUrl.replace('.png', '.webp');
                        } else if (imageUrl.includes('.webp')) {
                          target.src = imageUrl.replace('.webp', '.jpg');
                        } else {
                          // Final fallback
                          target.src = '/images/sudoz-purple.png';
                        }
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
                    <span className="text-gray-400">Metadata ID:</span>
                    <span className="text-purple-400 font-mono text-xs">{metadataId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Original:</span>
                    <span className="text-cyan-400">Artifact #{originalArtifactNumber}</span>
                  </div>
                  {originalPath !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Heritage:</span>
                      <span className="text-green-400 text-xs">
                        {CONTRACT_CONSTANTS.PATHS[parseInt(originalPath)]}
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