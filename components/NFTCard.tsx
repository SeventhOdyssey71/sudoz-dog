'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useSignAndExecuteTransaction, useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CONTRACT_CONSTANTS, REVENUE_CONFIG } from '@/constants/contract';
import { NFTData } from '@/hooks/use-nfts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Zap, Sparkles, ArrowUp, FlaskConical, Loader2 } from 'lucide-react';
import { ensureKiosk, getUserKiosks } from '@/utils/kioskUtils';

interface NFTCardProps {
  nft: NFTData;
}

export function NFTCard({ nft }: NFTCardProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isEvolving, setIsEvolving] = useState(false);
  const [targetLevel, setTargetLevel] = useState<number>(nft.level + 1);
  const [showEvolutionVideo, setShowEvolutionVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const handleSingleUpgrade = async () => {
    if (nft.level >= 10 || nft.type === 'evolved') return;
    
    setIsUpgrading(true);
    try {
      const tx = new Transaction();
      
      // Create coin for payment (1 SUI)
      const [coin] = tx.splitCoins(tx.gas, [CONTRACT_CONSTANTS.UPGRADE_COST_PER_LEVEL]);
      
      tx.moveCall({
        target: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.MODULE_NAME}::${CONTRACT_CONSTANTS.FUNCTIONS.UPGRADE_LEVEL}`,
        arguments: [
          tx.object(nft.objectId),
          coin,
          tx.object(CONTRACT_CONSTANTS.GLOBAL_STATS_ID),
          tx.object(CONTRACT_CONSTANTS.RANDOM_OBJECT_ID),
        ],
      });

      const result = await signAndExecute({
        transaction: tx,
      });

      // Calculate pool contributions
      const totalPaid = CONTRACT_CONSTANTS.UPGRADE_COST_PER_LEVEL / 1_000_000_000; // 1 SUI
      const devContribution = (totalPaid * REVENUE_CONFIG.DEV_PERCENTAGE) / 100;
      const founderContribution = (totalPaid * REVENUE_CONFIG.FOUNDER_PERCENTAGE) / 100;
      
      // Trigger a refetch immediately
      window.dispatchEvent(new Event('nft-updated'));
      
      toast.success('NFT upgraded successfully!', {
        description: (
          <div className="space-y-1">
            <p>{nft.name} is now level {nft.level + 1}</p>
          
          </div>
        ),
      });
    } catch (error) {
      console.error('Upgrade failed:', error);
      toast.error('Upgrade failed', {
        description: 'Please try again or check your wallet balance.',
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleBulkUpgrade = async () => {
    if (nft.level >= 10 || targetLevel <= nft.level || targetLevel > 10 || nft.type === 'evolved') return;
    
    setIsUpgrading(true);
    try {
      const tx = new Transaction();
      const upgradeCost = (targetLevel - nft.level) * CONTRACT_CONSTANTS.UPGRADE_COST_PER_LEVEL;
      
      // Create coin for payment
      const [coin] = tx.splitCoins(tx.gas, [upgradeCost]);
      
      tx.moveCall({
        target: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.MODULE_NAME}::${CONTRACT_CONSTANTS.FUNCTIONS.UPGRADE_TO_LEVEL}`,
        arguments: [
          tx.object(nft.objectId),
          tx.pure.u64(targetLevel),
          coin,
          tx.object(CONTRACT_CONSTANTS.GLOBAL_STATS_ID),
          tx.object(CONTRACT_CONSTANTS.RANDOM_OBJECT_ID),
        ],
      });

      const result = await signAndExecute({
        transaction: tx,
      });

      // Calculate pool contributions for bulk upgrade
      const levelsDone = targetLevel - nft.level;
      const totalPaidBulk = levelsDone * (CONTRACT_CONSTANTS.UPGRADE_COST_PER_LEVEL / 1_000_000_000); // SUI
      const devContributionBulk = (totalPaidBulk * REVENUE_CONFIG.DEV_PERCENTAGE) / 100;
      const founderContributionBulk = (totalPaidBulk * REVENUE_CONFIG.FOUNDER_PERCENTAGE) / 100;
      
      // Trigger a refetch immediately
      window.dispatchEvent(new Event('nft-updated'));
      
   
    } catch (error) {
      console.error('Bulk upgrade failed:', error);
      toast.error('Upgrade failed', {
        description: 'Please try again or check your wallet balance.',
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleEvolve = async () => {
    if (nft.level !== 10 || nft.type === 'evolved') return;
    
    setIsEvolving(true);
    try {
      // Step 1: Get available metadata IDs
      const evolvedStats = await client.getObject({
        id: CONTRACT_CONSTANTS.EVOLVED_STATS_ID,
        options: { showContent: true }
      });
      
      const availableIds = (evolvedStats.data?.content as any)?.fields?.available_metadata_ids || [];
      
      if (availableIds.length === 0) {
        toast.error('No evolved NFTs available!');
        setShowEvolutionVideo(false);
        return;
      }
      
      // Step 2: Select a random metadata ID
      const selectedMetadataId = availableIds[Math.floor(Math.random() * availableIds.length)];
      
      // Step 3: Fetch metadata and traits from IPFS
      const metadataUrl = `https://ipfs.io/ipfs/bafybeic7ymazpspv6ojxwrr6rqu3glnrtzbj3ej477nowr73brmb4hkkka/metadata/${selectedMetadataId}.json`;
      const response = await fetch(metadataUrl);
      const metadata = await response.json();
      
      // Extract traits
      const traitsMap = new Map<string, string>();
      metadata.attributes.forEach((attr: any) => {
        traitsMap.set(attr.trait_type.toLowerCase(), attr.value);
      });
      
      const traits = {
        background: traitsMap.get('background') || 'Unknown',
        skin: traitsMap.get('skin') || 'Unknown',
        clothes: traitsMap.get('clothes') || 'Unknown',
        hats: traitsMap.get('hats') || 'Unknown',
        eyewear: traitsMap.get('eyewear') || 'Unknown',
        mouth: traitsMap.get('mouth') || 'Unknown',
        earrings: traitsMap.get('earrings') || 'Unknown',
      };
      
      // Step 4: Default to Kiosk Evolution (marketplace ready)
      const evolutionType = true; // Always use Kiosk Evolution
      
      // Step 5: Execute evolution transaction
      if (evolutionType) {
        // Kiosk Evolution - Smart kiosk management
        const userAddress = account?.address;
        if (!userAddress) {
          toast.error('No wallet connected');
          setShowEvolutionVideo(false);
          return;
        }

        // Check if user has existing kiosks
        const existingKiosks = await getUserKiosks(client, userAddress);
        
        let kioskId: string;
        let kioskCapId: string;
        
        if (existingKiosks.length === 0) {
          // Create kiosk in a SEPARATE transaction first (to avoid Random object restrictions)
          console.log('Creating new kiosk in separate transaction...');
          
          const kioskTx = new Transaction();
          const [kiosk, kioskCap] = kioskTx.moveCall({
            target: '0x2::kiosk::new',
            arguments: [],
          });
          
          // Share the kiosk
          kioskTx.moveCall({
            target: '0x2::transfer::public_share_object',
            arguments: [kiosk],
            typeArguments: ['0x2::kiosk::Kiosk'],
          });
          
          // Transfer cap to user
          kioskTx.transferObjects([kioskCap], userAddress);
          
          // Execute kiosk creation first
          const kioskResult = await signAndExecute({
            transaction: kioskTx,
          });
          
          console.log('Kiosk creation result:', kioskResult);
          
          // Wait for blockchain to index the new kiosk
          toast.info('Creating kiosk...', { duration: 3000 });
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Fetch the newly created kiosk
          const updatedKiosks = await getUserKiosks(client, userAddress);
          if (updatedKiosks.length === 0) {
            toast.error('Failed to create kiosk. Please try again.');
            setShowEvolutionVideo(false);
            return;
          }
          
          kioskId = updatedKiosks[0].kioskId;
          kioskCapId = updatedKiosks[0].kioskCap;
          console.log('New kiosk created:', kioskId);
        } else {
          // Use existing kiosk
          kioskId = existingKiosks[0].kioskId;
          kioskCapId = existingKiosks[0].kioskCap;
          console.log('Using existing kiosk:', kioskId);
        }
        
        // Now create evolution transaction (separate from kiosk creation)
        const tx = new Transaction();
        
        // Always use evolve_artifact_to_kiosk since we have a kiosk
        tx.moveCall({
          target: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.MODULE_NAME}::${CONTRACT_CONSTANTS.FUNCTIONS.EVOLVE_ARTIFACT_TO_KIOSK}`,
          arguments: [
            tx.object(nft.objectId),
            tx.object(kioskId),
            tx.object(kioskCapId),
            tx.object(CONTRACT_CONSTANTS.TRANSFER_POLICY_ID),
            tx.object(CONTRACT_CONSTANTS.GLOBAL_STATS_ID),
            tx.object(CONTRACT_CONSTANTS.EVOLVED_STATS_ID),
            tx.object(CONTRACT_CONSTANTS.RANDOM_OBJECT_ID),
            tx.pure.u64(selectedMetadataId),
            tx.pure.string(traits.background),
            tx.pure.string(traits.skin),
            tx.pure.string(traits.clothes),
            tx.pure.string(traits.hats),
            tx.pure.string(traits.eyewear),
            tx.pure.string(traits.mouth),
            tx.pure.string(traits.earrings),
          ],
        });
        
        // Show evolution video after confirmation
        setShowEvolutionVideo(true);
        
        // Wait for video to play before executing transaction
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const evolutionResult = await signAndExecute({
          transaction: tx,
        });
        
        console.log('Evolution successful:', evolutionResult);
      } else {
        // Basic Evolution (simple transfer) - not used in current implementation
        const tx = new Transaction();
        tx.moveCall({
          target: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.MODULE_NAME}::${CONTRACT_CONSTANTS.FUNCTIONS.EVOLVE_ARTIFACT}`,
          arguments: [
            tx.object(nft.objectId),
            tx.object(CONTRACT_CONSTANTS.GLOBAL_STATS_ID),
            tx.object(CONTRACT_CONSTANTS.EVOLVED_STATS_ID),
            tx.object(CONTRACT_CONSTANTS.RANDOM_OBJECT_ID),
            tx.pure.u64(selectedMetadataId),
            tx.pure.string(traits.background),
            tx.pure.string(traits.skin),
            tx.pure.string(traits.clothes),
            tx.pure.string(traits.hats),
            tx.pure.string(traits.eyewear),
            tx.pure.string(traits.mouth),
            tx.pure.string(traits.earrings),
          ],
        });
        console.log('Using Basic Evolution - NFT will be transferred directly to you');
        
        // Show evolution video after confirmation
        setShowEvolutionVideo(true);
        
        // Wait for video to play before executing transaction
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const evolutionResult = await signAndExecute({
          transaction: tx,
        });
        
        console.log('Evolution successful:', evolutionResult);
      }
      
      console.log('Evolved to metadata ID:', selectedMetadataId);
      
      // Trigger multiple refreshes to ensure the evolved NFT is detected
      window.dispatchEvent(new Event('nft-updated'));
      
      // Additional refreshes with delays to catch blockchain updates
      setTimeout(() => window.dispatchEvent(new Event('nft-updated')), 2000);
      setTimeout(() => window.dispatchEvent(new Event('nft-updated')), 4000);
      
      toast.success('Evolution successful!', {
        description: `${nft.name} has evolved into ${metadata.name}!`,
      });
      
      // Hide video after a short delay
      setTimeout(() => {
        setShowEvolutionVideo(false);
      }, 500);
    } catch (error) {
      console.error('Evolution failed:', error);
      toast.error('Evolution failed', {
        description: 'Please try again.',
      });
      setShowEvolutionVideo(false);
    } finally {
      setIsEvolving(false);
    }
  };

  const progressPercentage = (nft.level / CONTRACT_CONSTANTS.MAX_LEVEL) * 100;
  const canUpgrade = nft.level < 10 && nft.type === 'artifact';
  const canEvolve = nft.level === 10 && nft.type === 'artifact'; // Fixed: should be 'artifact' not 'evolved'

  return (
    <>
      <Card className="bg-black/80 border-green-400/30 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-400/20">
        <CardContent className="p-6">
        {/* NFT Image */}
        <div className="relative mb-6">
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-900/50 border border-green-400/20 relative">
            {/* Loading Overlay */}
            {(isUpgrading || isEvolving) && (
              <div className="absolute inset-0 bg-black/80 z-10 flex flex-col items-center justify-center rounded-xl">
                <Loader2 className="w-8 h-8 text-green-400 animate-spin mb-2" />
                <span className="text-green-400 text-sm font-bold">
                  {isEvolving ? 'EVOLVING...' : 'UPGRADING...'}
                </span>
              </div>
            )}
            {nft.imageUrl ? (
              <Image
                src={nft.imageUrl}
                alt={nft.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized
                onError={(e) => {
                  // Fallback to a default image on error
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // Prevent infinite loop
                  target.src = '/images/sudoz-artifact.png';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-800">
                <FlaskConical className="w-16 h-16" />
                <span className="absolute bottom-2 text-xs">No Image</span>
              </div>
            )}
          </div>
          
          {/* Level Badge */}
          <Badge 
            className={`absolute top-3 right-3 text-black font-bold ${
              nft.type === 'evolved' 
                ? 'bg-purple-400 hover:bg-purple-400' 
                : nft.level === 10 
                  ? 'bg-yellow-400 hover:bg-yellow-400'
                  : 'bg-green-400 hover:bg-green-400'
            }`}
          >
            {nft.type === 'evolved' ? 'EVOLVED' : `LEVEL ${nft.level}`}
          </Badge>
        </div>

        {/* NFT Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">{nft.name}</h3>
            <p className="text-green-400 text-sm">#{nft.number}</p>
          </div>

          {/* Stats */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Points:</span>
              <span className="text-white font-bold">{nft.points}</span>
            </div>
            
            {nft.path !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Path:</span>
                <span className="text-cyan-400 font-bold text-xs">
                  {CONTRACT_CONSTANTS.PATHS[nft.path]}
                </span>
              </div>
            )}

            {nft.type === 'artifact' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Evolution Progress:</span>
                  <span className="text-white">{nft.level}/10</span>
                </div>
                <Progress 
                  value={progressPercentage} 
                  className="h-2 bg-gray-800" 
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {canUpgrade && (
            <div className="space-y-3">
              {/* Single Upgrade */}
              <Button
                onClick={handleSingleUpgrade}
                disabled={isUpgrading}
                className="w-full bg-green-400 hover:bg-green-500 text-black font-bold transition-all duration-300 hover:scale-105"
              >
                <ArrowUp className="w-4 h-4 mr-2" />
                {isUpgrading ? 'Upgrading...' : `Upgrade +1 Level (1 SUI)`}
              </Button>

              {/* Bulk Upgrade */}
              {nft.level < 10 && (
                <div className="space-y-2">
                  <Select 
                    value={targetLevel.toString()} 
                    onValueChange={(value) => setTargetLevel(parseInt(value))}
                    disabled={isUpgrading}
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                      <SelectValue placeholder="Select target level" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      {Array.from({ length: 10 - nft.level }, (_, i) => nft.level + i + 1).map((level) => (
                        <SelectItem key={level} value={level.toString()} className="text-white hover:bg-gray-800">
                          Level {level} ({level - nft.level} SUI)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button
                    onClick={handleBulkUpgrade}
                    disabled={isUpgrading || targetLevel <= nft.level}
                    variant="outline"
                    className="w-full border-purple-400 text-purple-400 hover:bg-purple-400/10 font-bold transition-all duration-300"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Upgrade to Level {targetLevel} ({targetLevel - nft.level} SUI)
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Evolution Button */}
          {nft.level === 10 && nft.type === 'artifact' && (
            <Button
              onClick={handleEvolve}
              disabled={isEvolving}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isEvolving ? 'Evolving...' : 'Evolve to Evolved SUDOZ'}
            </Button>
          )}

          {/* Evolved Status */}
          {nft.type === 'evolved' && (
            <div className="text-center p-4 bg-purple-500/20 rounded-lg border border-purple-400/30">
              <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-purple-400 font-bold">Fully Evolved</p>
              <p className="text-gray-400 text-sm">This SUDOZ has reached its final form</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>

    {/* Evolution Video Overlay */}
    {showEvolutionVideo && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
        <div className="relative w-full max-w-4xl mx-auto px-4">
          <video
            ref={videoRef}
            src="/sudozEvolve.mp4"
            autoPlay
            muted
            playsInline
            onEnded={() => {
              // Video will be hidden after the evolution transaction
            }}
            className="w-full h-auto rounded-xl shadow-2xl shadow-purple-500/50"
          />
          
          {/* Evolution Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-pulse">
                EVOLVING...
              </h2>
              <p className="text-xl text-purple-400">
                Genetic transformation in progress
              </p>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}