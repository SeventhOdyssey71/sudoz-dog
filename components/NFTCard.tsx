'use client';

import { useState } from 'react';
import { useSignAndExecuteTransaction, useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CONTRACT_CONSTANTS } from '@/constants/contract';
import { NFTData } from '@/hooks/use-nfts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Zap, Sparkles, ArrowUp, FlaskConical } from 'lucide-react';

interface NFTCardProps {
  nft: NFTData;
}

export function NFTCard({ nft }: NFTCardProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isEvolving, setIsEvolving] = useState(false);
  const [targetLevel, setTargetLevel] = useState<number>(nft.level + 1);
  
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

      toast.success('NFT upgraded successfully!', {
        description: `${nft.name} is now level ${nft.level + 1}`,
      });

      // Trigger a refetch
      setTimeout(() => {
        window.dispatchEvent(new Event('nft-updated'));
      }, 1000);
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

      toast.success('NFT upgraded successfully!', {
        description: `${nft.name} is now level ${targetLevel}`,
      });

      // Trigger a refetch
      setTimeout(() => {
        window.dispatchEvent(new Event('nft-updated'));
      }, 1000);
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
      const tx = new Transaction();
      
      // The evolve function returns the new Evolved NFT
      const [evolved] = tx.moveCall({
        target: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.MODULE_NAME}::${CONTRACT_CONSTANTS.FUNCTIONS.EVOLVE_ARTIFACT}`,
        arguments: [
          tx.object(nft.objectId),
          tx.object(CONTRACT_CONSTANTS.GLOBAL_STATS_ID),
          tx.object(CONTRACT_CONSTANTS.RANDOM_OBJECT_ID),
        ],
      });

      // Transfer the evolved NFT to the sender
      tx.transferObjects([evolved], tx.pure.address(account?.address || ''));

      const result = await signAndExecute({
        transaction: tx,
      });

      toast.success('Evolution successful!', {
        description: `${nft.name} has evolved into an Evolved SUDOZ!`,
      });

      // Trigger a refetch
      setTimeout(() => {
        window.dispatchEvent(new Event('nft-updated'));
      }, 1000);
    } catch (error) {
      console.error('Evolution failed:', error);
      toast.error('Evolution failed', {
        description: 'Please try again.',
      });
    } finally {
      setIsEvolving(false);
    }
  };

  const progressPercentage = (nft.level / CONTRACT_CONSTANTS.MAX_LEVEL) * 100;
  const canUpgrade = nft.level < 10 && nft.type === 'artifact';
  const canEvolve = nft.level === 10 && nft.type === 'evolved';

  return (
    <Card className="bg-black/80 border-green-400/30 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-400/20">
      <CardContent className="p-6">
        {/* NFT Image */}
        <div className="relative mb-6">
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-900/50 border border-green-400/20">
            {nft.imageUrl ? (
              <img
                src={nft.imageUrl}
                alt={nft.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <FlaskConical className="w-16 h-16" />
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
  );
}