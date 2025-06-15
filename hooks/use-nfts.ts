'use client';

import { useState, useEffect } from 'react';
import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { CONTRACT_CONSTANTS } from '@/constants/contract';
import { getUserKiosks } from '@/utils/kioskUtils';

// BlockVision API Key (optional - we'll use direct methods if it fails)
const BLOCKVISION_API_KEY = '2vmcIQeMF5JdhEXyuyQ8n79UNoO';

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
  const [isRefetching, setIsRefetching] = useState(false);
  
  const client = useSuiClient();
  const account = useCurrentAccount();

  // Fetch NFTs using BlockVision API
  const fetchNFTDataForWallet = async (walletAddress: string) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("X-API-KEY", BLOCKVISION_API_KEY);
      myHeaders.append("Content-Type", "application/json");

      // Use the correct endpoint for Sui NFTs
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };

      // Try the correct endpoint format for BlockVision Sui API
      const response = await fetch(
        `https://api.blockvision.org/v1/sui/mainnet/account/${walletAddress}/nfts?limit=100`,
        requestOptions
      );

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

      // Fetch SUDOZ Artifacts using original method (they're not in kiosks)
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

      // Try to fetch NFTs from BlockVision API (includes kiosk NFTs)
      // This is optional - if it fails, we'll use direct methods
      let blockVisionData = null;
      blockVisionData = await fetchNFTDataForWallet(account.address);
      if (blockVisionData) {
        console.log('BlockVision API response:', blockVisionData);
      }
      
      // Try multiple approaches to fetch evolved NFTs
      // 1. Direct ownership (for basic evolution)
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
      
      console.log('Direct evolved NFTs found:', evolvedResponse.data.length);
      
      // 2. Try alternative type format
      const evolvedResponse2 = await client.getOwnedObjects({
        owner: account.address,
        filter: {
          MatchAll: [
            {
              StructType: `${CONTRACT_CONSTANTS.PACKAGE_ID}::evolved_sudoz::EvolvedSudoz`,
            },
          ],
        },
        options: {
          showContent: true,
          showDisplay: true,
        },
      });
      
      console.log('Alternative query evolved NFTs found:', evolvedResponse2.data.length);
      
      // Parse evolved NFTs from BlockVision data if available
      const kioskEvolvedNfts: any[] = [];
      
      if (blockVisionData?.result) {
        // BlockVision v1 API response format
        const nfts = Array.isArray(blockVisionData.result) ? blockVisionData.result : [];
        
        for (const nft of nfts) {
          // Check if this is an evolved NFT by type
          if (nft.type?.includes('EvolvedSudoz') || 
              nft.type?.includes(CONTRACT_CONSTANTS.EVOLVED_MODULE_NAME) ||
              nft.name?.includes('SUDOZ') || 
              nft.name?.includes('Evolved')) {
            
            // Fetch detailed object data
            try {
              const objectData = await client.getObject({
                id: nft.objectId || nft.id,
                options: {
                  showContent: true,
                  showDisplay: true,
                }
              });
              
              if (objectData.data) {
                kioskEvolvedNfts.push(objectData);
              }
            } catch (err) {
              console.error('Error fetching NFT details:', err);
            }
          }
        }
      }
      
      // Also get kiosks and fetch their dynamic fields
      const userKiosks = await getUserKiosks(client, account.address);
      console.log('User kiosks:', userKiosks);
      
      // Fetch NFTs from kiosks using getDynamicFields
      for (const kiosk of userKiosks) {
        try {
          // Get dynamic fields of the kiosk (items stored in kiosk)
          const dynamicFields = await client.getDynamicFields({
            parentId: kiosk.kioskId,
          });
          
          console.log(`Kiosk ${kiosk.kioskId} dynamic fields:`, dynamicFields.data.length);
          
          // Fetch each item in the kiosk
          for (const field of dynamicFields.data) {
            try {
              const fieldType = field.objectType || '';
              
              // Check if this is a kiosk item
              if (fieldType.includes('0x2::dynamic_field::Field')) {
                const itemData = await client.getDynamicFieldObject({
                  parentId: kiosk.kioskId,
                  name: field.name,
                });
                
                if (itemData.data?.content?.dataType === 'moveObject') {
                  const content = itemData.data.content as any;
                  const valueType = content.fields?.value?.type || '';
                  
                  // Check if this is an evolved NFT by checking the type
                  // The evolved NFT type should include the package ID and evolved_sudoz module
                  if (valueType.includes(CONTRACT_CONSTANTS.PACKAGE_ID) && 
                      valueType.includes('evolved_sudoz::EvolvedSudoz')) {
                    
                    console.log('Found evolved NFT in kiosk with type:', valueType);
                    
                    // The value field contains the actual NFT data
                    const evolvedNftFields = content.fields?.value?.fields;
                    if (evolvedNftFields) {
                      // Create a proper object structure that matches the direct ownership format
                      const nftObject = {
                        data: {
                          objectId: field.objectId || itemData.data?.objectId,
                          content: {
                            dataType: 'moveObject',
                            type: valueType,
                            fields: evolvedNftFields,
                            hasPublicTransfer: false,
                          },
                          display: {
                            data: {
                              name: evolvedNftFields.name || `THE SUDOZ #${evolvedNftFields.number}`,
                              image_url: evolvedNftFields.image_url || '',
                              description: evolvedNftFields.description || '',
                            }
                          },
                          owner: {
                            ObjectOwner: kiosk.kioskId
                          },
                          type: valueType,
                        }
                      };
                      
                      kioskEvolvedNfts.push(nftObject);
                      console.log('Added evolved NFT from kiosk:', {
                        objectId: nftObject.data.objectId,
                        number: evolvedNftFields.number,
                        metadataId: evolvedNftFields.metadata_id,
                      });
                    }
                  }
                }
              }
            } catch (err) {
              console.error('Error fetching kiosk item:', err);
            }
          }
        } catch (err) {
          console.error('Error fetching kiosk dynamic fields:', err);
        }
      }
      
      console.log('Total evolved NFTs found in kiosks:', kioskEvolvedNfts.length);

      // Parse artifacts
      const parsedArtifacts: NFTData[] = artifactsResponse.data
        .map((nft) => {
          if (!nft.data?.content || nft.data.content.dataType !== 'moveObject') {
            console.warn('Skipping artifact - invalid data type:', nft.data);
            return null;
          }

          const content = nft.data.content.fields as any;
          const display = nft.data.display?.data || {};
          
          // Debug logging for artifacts
          if (!display.image_url && !content.image_url) {
            console.warn('Artifact missing image URL:', { objectId: nft.data.objectId, content, display });
          }
          
          let imageUrl = display.image_url || content.image_url || '';
          
          // For evolved NFTs, construct the proper image URL
          if (content.metadata_id) {
            // Use Pinata gateway for evolved NFTs
            imageUrl = `https://moccasin-grateful-spider-300.mypinata.cloud/ipfs/bafybeic7ymazpspv6ojxwrr6rqu3glnrtzbj3ej477nowr73brmb4hkkka/images/${content.metadata_id}.png`;
          } else if (imageUrl.startsWith('ipfs://')) {
            // Convert IPFS URLs to HTTP gateway URLs
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
            path: content.path !== undefined ? parseInt(content.path) : undefined,
            number: parseInt(content.number || '0'),
            type: 'artifact' as const,
          };
        })
        .filter((nft): nft is NFTData => nft !== null);

      // Combine evolved NFTs from all sources
      const combinedEvolvedNfts = [...evolvedResponse.data, ...evolvedResponse2.data];
      
      // Remove duplicates from direct queries
      const uniqueDirectNfts = combinedEvolvedNfts.filter((nft, index, self) => 
        index === self.findIndex(n => n.data?.objectId === nft.data?.objectId)
      );
      
      // Add kiosk NFTs, avoiding duplicates
      const existingIds = new Set(uniqueDirectNfts.map(nft => nft.data?.objectId));
      const allEvolvedNfts = [...uniqueDirectNfts];
      
      for (const kioskNft of kioskEvolvedNfts) {
        if (!existingIds.has(kioskNft.data?.objectId)) {
          allEvolvedNfts.push(kioskNft);
        }
      }
      
      // Parse evolved NFTs
      const parsedEvolved: NFTData[] = allEvolvedNfts
        .map((nft) => {
          if (!nft.data?.content || nft.data.content.dataType !== 'moveObject') {
            return null;
          }

          const content = nft.data.content.fields as any;
          const display = nft.data.display?.data || {};
          
          let imageUrl = display.image_url || content.image_url || '';
          const metadataId = content.metadata_id || '';
          
          // Debug logging for evolved NFTs
          console.log('Processing evolved NFT:', {
            objectId: nft.data.objectId,
            hasDisplay: !!display.image_url,
            metadataId,
            contentFields: Object.keys(content || {}),
          });
          
          // Convert IPFS URLs to HTTP gateway URLs
          if (imageUrl.startsWith('ipfs://')) {
            const ipfsHash = imageUrl.replace('ipfs://', '');
            imageUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
          }
          
          // For evolved NFTs, construct the proper image URL using metadata_id
          if (metadataId) {
            // Use the WebP version of evolved NFTs with the correct IPFS hash
            imageUrl = `https://plum-defeated-leopon-866.mypinata.cloud/ipfs/bafybeic7kknhjbvdrrkzlthi7zvqg7ilxeeckcq3d7y54qv3xngiw2pjui/nfts/${metadataId}.webp`;
            console.log('Constructed evolved image URL:', imageUrl);
          }
          
          // Fallback: if still no proper image and it's a placeholder
          if (imageUrl.includes('placeholder.webp') && metadataId) {
            imageUrl = `https://plum-defeated-leopon-866.mypinata.cloud/ipfs/bafybeic7kknhjbvdrrkzlthi7zvqg7ilxeeckcq3d7y54qv3xngiw2pjui/nfts/${metadataId}.webp`;
          }
          
          // Additional fallback: Try to construct URL from number if no metadata_id
          if (!imageUrl && content.number) {
            const paddedNumber = content.number.toString().padStart(4, '0');
            imageUrl = `https://plum-defeated-leopon-866.mypinata.cloud/ipfs/bafybeic7kknhjbvdrrkzlthi7zvqg7ilxeeckcq3d7y54qv3xngiw2pjui/nfts/${paddedNumber}.webp`;
          }
          
          const parsedName = display.name || content.name || `THE SUDOZ #${content.number || 'Unknown'}`;
          
          console.log('Parsed evolved NFT:', {
            objectId: nft.data.objectId,
            name: parsedName,
            metadataId,
            imageUrl,
            number: content.number,
          });

          return {
            objectId: nft.data.objectId,
            name: parsedName,
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
      
      // Log successful fetch
      console.log('NFTs fetched successfully:', {
        artifacts: parsedArtifacts.length,
        evolved: parsedEvolved.length,
        account: account.address,
        directEvolvedCount: evolvedResponse.data.length,
        altQueryEvolvedCount: evolvedResponse2.data.length,
        kioskEvolvedCount: kioskEvolvedNfts.length,
        totalEvolvedCount: allEvolvedNfts.length,
        evolvedType: CONTRACT_CONSTANTS.TYPES.EVOLVED_SUDOZ,
        blockVisionData: blockVisionData?.result?.length || 0,
        userKiosks: userKiosks.length,
      });
    } catch (err) {
      console.error('Error fetching NFTs:', err);
      // Don't show error on first load or if it's just a network hiccup
      if (!isRefetching && artifacts.length === 0 && evolvedNFTs.length === 0) {
        setError('Failed to fetch NFTs');
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