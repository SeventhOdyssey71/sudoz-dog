'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CONTRACT_CONSTANTS } from '@/constants/contract';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Gift, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Claim pool constants from deployment
const CLAIM_POOL_CONSTANTS = {
  PACKAGE_ID: '0xf845f3496693948188d12548be2a704f5152f299377fcb7c80b8662d89d80277',
  NFT_GATED_CLAIM_POOL_ID: '0x0639d8b8721a4379d052d52b58ac33cbea6db458cc0ede160274a9909086a03d',
  BASIC_CLAIM_POOL_ID: '0xb691f23cbaf400669e36bc24aaf94e6ee4844982fc4c266561bbc9a5683d979c',
  NFT_GATED_MODULE: 'nft_gated_claim_pool_v2',
  CLAIM_POOL_MODULE: 'claim_pool',
  
  ELIGIBLE_COLLECTIONS: {
    PRIME_MACHIN: {
      TYPE: '0x034c162f6b594cb5a1805264dd01ca5d80ce3eca6522e6ee37fd9ebfb9d3ddca::factory::PrimeMachin',
      NAME: 'Prime Machin',
    },
    ROOTLET: {
      TYPE: '0x8f74a7d632191e29956df3843404f22d27bd84d92cca1b1abde621d033098769::rootlet::Rootlet',
      NAME: 'Rootlet',
    },
  },
};

interface ClaimPoolProps {
  onClaimSuccess?: () => void;
}

interface EligibleNFT {
  objectId: string;
  name: string;
  collection: string;
  type: 'prime' | 'rootlet';
}

export function ClaimPool({ onClaimSuccess }: ClaimPoolProps) {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  
  const [isClaiming, setIsClaiming] = useState(false);
  const [isLoadingPool, setIsLoadingPool] = useState(true);
  const [poolStats, setPoolStats] = useState<any>(null);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [eligibleNfts, setEligibleNfts] = useState<EligibleNFT[]>([]);
  const [selectedNft, setSelectedNft] = useState<EligibleNFT | null>(null);
  const [checkingNfts, setCheckingNfts] = useState(false);
  const [eligibleCollections, setEligibleCollections] = useState<string[]>([]);

  // Fetch pool data on component mount
  useEffect(() => {
    const fetchPoolData = async () => {
      if (!client) return;
      
      setIsLoadingPool(true);
      let poolObject;
      try {
        poolObject = await client.getObject({
          id: CLAIM_POOL_CONSTANTS.NFT_GATED_CLAIM_POOL_ID,
          options: {
            showContent: true,
          },
        });
        
        console.log('Pool object:', poolObject); // Debug log
        
        if (poolObject.data?.content?.dataType === 'moveObject') {
          const fields = (poolObject.data.content as any).fields;
          console.log('Pool fields:', fields); // Debug log
          
          setPoolStats({
            availableCount: fields.nft_ids?.length || 0,
            totalClaimed: parseInt(fields.total_claimed || '0'),
            claimingEnabled: fields.claiming_enabled || false,
            admin: fields.admin || '',
          });
          
          // Extract and set eligible collections from the pool data
          if (fields.eligible_collections?.fields?.contents) {
            console.log('Raw eligible collections:', fields.eligible_collections.fields.contents);
            const collections = fields.eligible_collections.fields.contents.map((col: any) => {
              // Convert bytes back to string
              if (Array.isArray(col)) {
                return new TextDecoder().decode(new Uint8Array(col));
              }
              return col;
            });
            console.log('Parsed eligible collections:', collections);
            setEligibleCollections(collections);
          } else if (fields.eligible_collections?.contents) {
            // Alternative structure
            console.log('Raw eligible collections (alt):', fields.eligible_collections.contents);
            const collections = fields.eligible_collections.contents.map((col: any) => {
              if (Array.isArray(col)) {
                return new TextDecoder().decode(new Uint8Array(col));
              }
              return col;
            });
            console.log('Parsed eligible collections:', collections);
            setEligibleCollections(collections);
          } else {
            console.log('No eligible collections found in contract data, using defaults');
            // Set defaults if not found in contract
            setEligibleCollections([
              CLAIM_POOL_CONSTANTS.ELIGIBLE_COLLECTIONS.PRIME_MACHIN.TYPE,
              CLAIM_POOL_CONSTANTS.ELIGIBLE_COLLECTIONS.ROOTLET.TYPE
            ]);
          }
          
          // Check if user has already claimed from the has_claimed table
          if (account?.address && fields.has_claimed) {
            console.log('Has claimed structure:', fields.has_claimed);
            
            let userClaimed = false;
            if (fields.has_claimed.fields?.contents) {
              userClaimed = fields.has_claimed.fields.contents.some(
                (entry: any) => {
                  console.log('Claim entry:', entry);
                  const key = entry.fields?.key || entry.key;
                  return key === account.address;
                }
              );
            } else if (fields.has_claimed.contents) {
              // Alternative structure
              userClaimed = fields.has_claimed.contents.some(
                (entry: any) => {
                  const key = entry.fields?.key || entry.key;
                  return key === account.address;
                }
              );
            }
            
            console.log(`User ${account.address} has claimed:`, userClaimed);
            setHasClaimed(userClaimed);
          } else {
            setHasClaimed(false);
          }
        } else {
          console.log('No valid content found in pool object');
          setPoolStats({
            availableCount: 0,
            claimingEnabled: false,
          });
        }
      } catch (error) {
        console.error('Failed to fetch pool data:', error);
        if (poolObject) console.error('Pool object:', poolObject);
        toast.error('Failed to load claim pool');
        
        // Set some default values so UI doesn't break
        setPoolStats({
          availableCount: 0,
          claimingEnabled: false,
        });
      } finally {
        setIsLoadingPool(false);
      }
    };

    fetchPoolData();
  }, [client, account]);

  // Fetch NFTs from BlockVision API when wallet connects
  useEffect(() => {
    const fetchEligibleNfts = async () => {
      if (!account || eligibleCollections.length === 0) return;
      
      setCheckingNfts(true);
      try {
        // Fetch both kiosk NFTs and regular NFTs
        const [kioskResponse, regularResponse] = await Promise.all([
          fetch(
            `https://api.blockvision.org/v2/sui/account/nfts?account=${account.address}&type=kiosk&pageIndex=1&pageSize=100`,
            {
              headers: {
                'accept': 'application/json',
                'x-api-key': '2vmcIQeMF5JdhEXyuyQ8n79UNoO'
              }
            }
          ),
          fetch(
            `https://api.blockvision.org/v2/sui/account/nfts?account=${account.address}&pageIndex=1&pageSize=100`,
            {
              headers: {
                'accept': 'application/json',
                'x-api-key': '2vmcIQeMF5JdhEXyuyQ8n79UNoO'
              }
            }
          )
        ]);
        
        const kioskData = await kioskResponse.json();
        const regularData = await regularResponse.json();
        
        const allNfts = new Map(); // Use Map to deduplicate by objectId
        
        // Add kiosk NFTs
        if (kioskData.code === 200 && kioskData.result?.data) {
          kioskData.result.data.forEach((nft: any) => {
            allNfts.set(nft.objectId, { ...nft, isInKiosk: true });
          });
        }
        
        // Add regular NFTs (some might overlap with kiosk ones)
        if (regularData.code === 200 && regularData.result?.data) {
          regularData.result.data.forEach((nft: any) => {
            if (!allNfts.has(nft.objectId)) {
              allNfts.set(nft.objectId, { ...nft, isInKiosk: false });
            }
          });
        }
        
        const eligible: EligibleNFT[] = [];
        
        // Check each unique NFT for eligibility
        allNfts.forEach((nft) => {
          // Check if NFT collection is in the eligible list
          if (eligibleCollections.includes(nft.collection)) {
            // Determine type based on known collections
            let type: 'prime' | 'rootlet' = 'prime'; // default
            if (nft.collection === CLAIM_POOL_CONSTANTS.ELIGIBLE_COLLECTIONS.PRIME_MACHIN.TYPE) {
              type = 'prime';
            } else if (nft.collection === CLAIM_POOL_CONSTANTS.ELIGIBLE_COLLECTIONS.ROOTLET.TYPE) {
              type = 'rootlet';
            }
            
            eligible.push({
              objectId: nft.objectId,
              name: nft.name || 'Eligible NFT',
              collection: nft.collection,
              type: type,
            });
          }
        });
        
        setEligibleNfts(eligible);
        
        // Auto-select first NFT if available
        if (eligible.length > 0) {
          setSelectedNft(eligible[0]);
        }
      } catch (error) {
        console.error('Error fetching NFTs from BlockVision:', error);
      } finally {
        setCheckingNfts(false);
      }
    };
    
    fetchEligibleNfts();
  }, [account, eligibleCollections]);

  // Determine if user can claim
  useEffect(() => {
    if (poolStats && account) {
      const can = poolStats.claimingEnabled && 
                  poolStats.availableCount > 0 && 
                  !hasClaimed &&
                  eligibleNfts.length > 0; // Must have eligible NFTs
      setCanClaim(can);
    }
  }, [poolStats, hasClaimed, account, eligibleNfts]);

  const handleClaim = async () => {
    if (!account || !canClaim || !selectedNft) return;
    
    setIsClaiming(true);
    setClaimSuccess(false);
    
    try {
      const tx = new Transaction();
      
      // Use the selected NFT's collection type
      const collectionTypeBytes = Array.from(new TextEncoder().encode(selectedNft.collection));
      
      tx.moveCall({
        target: `${CLAIM_POOL_CONSTANTS.PACKAGE_ID}::${CLAIM_POOL_CONSTANTS.NFT_GATED_MODULE}::claim_simple`,
        typeArguments: [`${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.MODULE_NAME}::SudozArtifact`],
        arguments: [
          tx.object(CLAIM_POOL_CONSTANTS.NFT_GATED_CLAIM_POOL_ID),
          tx.pure.vector('u8', collectionTypeBytes),
        ],
      });
      
      const result = await signAndExecute({
        transaction: tx,
      });
      
      if (result.effects?.status === 'success') {
        setClaimSuccess(true);
        toast.success('NFT claimed successfully!');
        
        // Call the success callback
        if (onClaimSuccess) {
          setTimeout(() => {
            onClaimSuccess();
          }, 2000);
        }
      }
    } catch (error: any) {
      console.error('Claim failed:', error);
      toast.error(error.message || 'Failed to claim NFT');
    } finally {
      setIsClaiming(false);
    }
  };

  if (isLoadingPool) {
    return (
      <Card className="bg-black/50 border-green-400/20 max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
            <p className="text-green-400">Loading claim pool...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/50 border-green-400/20 max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="w-20 h-20 bg-green-400/10 rounded-full flex items-center justify-center mx-auto">
            <Gift className="w-10 h-10 text-green-400" />
          </div>

          {/* Title */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">CLAIM FREE ARTIFACT</h3>
            <p className="text-gray-400">
              Claim your free SUDOZ artifact if you hold Prime Machin or Rootlet NFTs
            </p>
          </div>

          {/* Eligible Collections */}
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">Eligible Collections:</h4>
            <div className="flex flex-wrap gap-2">
              {eligibleCollections.length > 0 ? (
                eligibleCollections.map((collection, index) => {
                  // Extract a readable name from the collection type
                  let displayName = collection;
                  let colorClass = "bg-blue-600/20 text-blue-400 border-blue-400/30";
                  
                  if (collection.includes('PrimeMachin')) {
                    displayName = 'Prime Machin';
                    colorClass = "bg-blue-600/20 text-blue-400 border-blue-400/30";
                  } else if (collection.includes('Rootlet')) {
                    displayName = 'Rootlet';
                    colorClass = "bg-green-600/20 text-green-400 border-green-400/30";
                  } else {
                    // Extract module name for other collections
                    const parts = collection.split('::');
                    displayName = parts[parts.length - 1] || collection;
                  }
                  
                  return (
                    <span key={index} className={`text-xs px-2 py-1 rounded-full border ${colorClass}`}>
                      {displayName}
                    </span>
                  );
                })
              ) : (
                <>
                  <span className="bg-gray-600/20 text-gray-400 text-xs px-2 py-1 rounded-full border border-gray-400/30">
                    Loading...
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-yellow-400 mt-2">
              ⚠️ You must own one of these NFT collections to claim
            </p>
          </div>

          {/* Pool Stats */}
          {poolStats && (
            <div className="bg-gray-900/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Pool Status:</span>
                <span className={poolStats.claimingEnabled ? 'text-green-400' : 'text-red-400'}>
                  {poolStats.claimingEnabled ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Available NFTs:</span>
                <span className="text-white font-bold">{poolStats.availableCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Total Claimed:</span>
                <span className="text-white">{poolStats.totalClaimed || 0}</span>
              </div>
              {hasClaimed && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Your Status:</span>
                  <span className="text-green-400">Already Claimed ✓</span>
                </div>
              )}
            </div>
          )}

          {/* Eligibility Check */}
          {account && (
            <div className="space-y-4">
              {checkingNfts ? (
                <div className="bg-blue-900/30 border border-blue-400/30 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                    <p className="text-sm text-blue-400">Checking your eligible NFTs...</p>
                  </div>
                </div>
              ) : eligibleNfts.length > 0 ? (
                <div className="bg-green-900/30 border border-green-400/30 rounded-lg p-4">
                  <p className="text-sm text-green-400 font-medium mb-3">
                    ✅ Found {eligibleNfts.length} eligible NFT{eligibleNfts.length > 1 ? 's' : ''}!
                  </p>
                  
                  {eligibleNfts.length > 1 && (
                    <div className="space-y-2">
                      <label className="text-sm text-white">Select NFT to use for claiming:</label>
                      <select
                        value={selectedNft?.objectId || ''}
                        onChange={(e) => {
                          const nft = eligibleNfts.find(n => n.objectId === e.target.value);
                          setSelectedNft(nft || null);
                        }}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                        disabled={isClaiming}
                      >
                        {eligibleNfts.map((nft) => (
                          <option key={nft.objectId} value={nft.objectId}>
                            {nft.name} ({nft.type === 'prime' ? 'Prime Machin' : 'Rootlet'})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {selectedNft && (
                    <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                      <p className="text-sm text-white font-medium">Using: {selectedNft.name}</p>
                      <p className="text-xs text-gray-400">
                        Collection: {selectedNft.type === 'prime' ? 'Prime Machin' : 'Rootlet'}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-red-900/30 border border-red-400/30 rounded-lg p-4">
                  <p className="text-sm text-red-400 font-medium">
                    ❌ No eligible NFTs found
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    You need to own Prime Machin or Rootlet NFTs to claim from this pool.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Claim Button */}
          <Button
            onClick={handleClaim}
            disabled={!canClaim || isClaiming || claimSuccess}
            className={`w-full py-6 text-lg font-bold transition-all ${
              canClaim && !claimSuccess
                ? 'bg-green-400 hover:bg-green-500 text-black'
                : claimSuccess
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isClaiming ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                CLAIMING...
              </>
            ) : claimSuccess ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                CLAIMED SUCCESSFULLY!
              </>
            ) : !canClaim ? (
              poolStats?.availableCount === 0 ? 'POOL EMPTY' :
              !poolStats?.claimingEnabled ? 'CLAIMING PAUSED' :
              hasClaimed ? 'ALREADY CLAIMED' :
              eligibleNfts.length === 0 ? 'NO ELIGIBLE NFTs' :
              'CONNECT WALLET TO CLAIM'
            ) : (
              'CLAIM YOUR FREE NFT'
            )}
          </Button>

          {/* Info */}
          {poolStats?.availableCount === 0 && (
            <div className="text-sm text-yellow-500">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              The claim pool is currently empty. Check back later!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}