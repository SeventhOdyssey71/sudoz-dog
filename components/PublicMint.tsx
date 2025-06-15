'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CONTRACT_CONSTANTS, REVENUE_CONFIG } from '@/constants/contract';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ensureKiosk } from '@/utils/kioskUtils';
import { 
  FlaskConical, 
  Loader2, 
  Info,
  Coins,
  AlertCircle,
  CheckCircle,
  Zap,
  Timer,
  Users
} from 'lucide-react';

// Public mint configuration (would need to be added to contract)
const MINT_CONFIG = {
  PRICE_PER_NFT: 20, // 20 SUI per NFT
  MAX_PER_TX: 10,
  MAX_PER_WALLET: 20,
};

export function PublicMint() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const [isMinting, setIsMinting] = useState(false);
  const [mintAmount, setMintAmount] = useState(1);
  const [userMinted, setUserMinted] = useState(0);

  // Fetch global stats
  const { data: statsData, refetch: refetchStats } = useSuiClientQuery('getObject', {
    id: CONTRACT_CONSTANTS.GLOBAL_STATS_ID,
    options: {
      showContent: true,
    },
  });

  // Get user's current minted count (would need contract support)
  useEffect(() => {
    const fetchUserMinted = async () => {
      if (!account?.address) return;
      // This would require a contract function to track per-wallet mints
      // For now, we'll simulate it
      setUserMinted(0);
    };
    fetchUserMinted();
  }, [account]);

  const stats = statsData?.data?.content && 'fields' in statsData.data.content 
    ? statsData.data.content.fields as any
    : null;

  const artifactsMinted = parseInt(stats?.artifacts_minted || '0');
  const remaining = CONTRACT_CONSTANTS.ARTIFACT_SUPPLY - artifactsMinted;
  const canMintMore = userMinted < MINT_CONFIG.MAX_PER_WALLET;

  const handleMint = async () => {
    if (!account?.address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (mintAmount < 1 || mintAmount > MINT_CONFIG.MAX_PER_TX) {
      toast.error(`Please enter a valid amount (1-${MINT_CONFIG.MAX_PER_TX})`);
      return;
    }

    if (userMinted + mintAmount > MINT_CONFIG.MAX_PER_WALLET) {
      toast.error(`This would exceed your wallet limit of ${MINT_CONFIG.MAX_PER_WALLET} NFTs`);
      return;
    }

    setIsMinting(true);
    try {
      const tx = new Transaction();
      
      // Calculate total cost
      const totalCost = mintAmount * MINT_CONFIG.PRICE_PER_NFT * 1_000_000_000; // Convert to MIST

      // This would be the public mint function (needs to be added to contract):
      /*
      tx.moveCall({
        target: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.MODULE_NAME}::public_mint`,
        arguments: [
          tx.pure.u64(mintAmount),
          tx.splitCoins(tx.gas, [tx.pure.u64(totalCost)]),
          tx.object(CONTRACT_CONSTANTS.GLOBAL_STATS_ID),
        ],
      });
      */

      // For now, show what would happen
      toast.info('Public minting is not yet enabled in the contract', {
        description: 'This feature requires contract update to enable public minting',
      });
      return;

      const result = await signAndExecute({
        transaction: tx,
      });

      toast.success(`Successfully minted ${mintAmount} SUDOZ ARTIFACT${mintAmount > 1 ? 's' : ''}!`, {
        description: `Transaction: ${result.digest}`,
        action: {
          label: 'View on Explorer',
          onClick: () => window.open(`https://suivision.xyz/txblock/${result.digest}`, '_blank'),
        },
      });

      // Update user minted count
      setUserMinted(prev => prev + mintAmount);
      
      // Reset amount
      setMintAmount(1);

      setTimeout(() => {
        refetchStats();
        window.dispatchEvent(new Event('nft-updated'));
      }, 2000);
    } catch (error) {
      console.error('Minting failed:', error);
      toast.error('Failed to mint NFTs', {
        description: 'Please try again',
      });
    } finally {
      setIsMinting(false);
    }
  };

  // Calculate progress percentage
  const mintProgress = (artifactsMinted / CONTRACT_CONSTANTS.ARTIFACT_SUPPLY) * 100;

  return (
    <div className="w-full space-y-6">
      {/* Mint Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black/50 border-green-400/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <FlaskConical className="w-5 h-5 text-green-400" />
              <span className="text-xs text-green-400">MINTED</span>
            </div>
            <div className="text-2xl font-bold text-white">{artifactsMinted.toLocaleString()}</div>
            <p className="text-xs text-gray-400 mt-1">of {CONTRACT_CONSTANTS.ARTIFACT_SUPPLY.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-purple-400/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Timer className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-purple-400">REMAINING</span>
            </div>
            <div className="text-2xl font-bold text-white">{remaining.toLocaleString()}</div>
            <p className="text-xs text-gray-400 mt-1">Available to mint</p>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-cyan-400/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Coins className="w-5 h-5 text-cyan-400" />
              <span className="text-xs text-cyan-400">PRICE</span>
            </div>
            <div className="text-2xl font-bold text-white">{MINT_CONFIG.PRICE_PER_NFT} SUI</div>
            <p className="text-xs text-gray-400 mt-1">Per artifact</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="bg-black/50 border-green-400/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Mint Progress</span>
            <span className="text-sm font-bold text-green-400">{mintProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-500"
              style={{ width: `${mintProgress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Mint Interface */}
      <Card className="bg-black/50 border-green-400/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-green-400">Public Mint</CardTitle>
            {remaining === 0 ? (
              <Badge className="bg-red-400 text-white">SOLD OUT</Badge>
            ) : (
              <Badge className="bg-green-400 text-black">LIVE</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {account ? (
            <>
              {/* User Stats */}
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-400">Your Mints:</span>
                  </div>
                  <span className="text-white font-bold">
                    {userMinted} / {MINT_CONFIG.MAX_PER_WALLET}
                  </span>
                </div>
              </div>

              {/* Mint Controls */}
              {canMintMore && remaining > 0 ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Amount to mint</label>
                      <div className="flex items-center space-x-4">
                        <Button
                          onClick={() => setMintAmount(Math.max(1, mintAmount - 1))}
                          disabled={mintAmount <= 1 || isMinting}
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-400 hover:bg-gray-800"
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          value={mintAmount}
                          onChange={(e) => setMintAmount(parseInt(e.target.value) || 1)}
                          min={1}
                          max={Math.min(MINT_CONFIG.MAX_PER_TX, MINT_CONFIG.MAX_PER_WALLET - userMinted)}
                          className="w-20 text-center bg-gray-900 border-gray-700 text-white"
                          disabled={isMinting}
                        />
                        <Button
                          onClick={() => setMintAmount(Math.min(MINT_CONFIG.MAX_PER_TX, mintAmount + 1))}
                          disabled={mintAmount >= MINT_CONFIG.MAX_PER_TX || isMinting}
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-400 hover:bg-gray-800"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Total Cost:</span>
                        <span className="text-xl font-bold text-green-400">
                          {(mintAmount * MINT_CONFIG.PRICE_PER_NFT).toFixed(0)} SUI
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleMint}
                    disabled={isMinting || remaining === 0}
                    className="w-full bg-green-400 hover:bg-green-500 text-black font-bold py-6 text-lg"
                  >
                    {isMinting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Minting...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Mint {mintAmount} Artifact{mintAmount > 1 ? 's' : ''}
                      </>
                    )}
                  </Button>
                </>
              ) : remaining === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <p className="text-lg font-bold text-white">Mint Sold Out!</p>
                  <p className="text-gray-400 mt-2">All {CONTRACT_CONSTANTS.ARTIFACT_SUPPLY.toLocaleString()} artifacts have been minted</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-lg font-bold text-white">Wallet Limit Reached</p>
                  <p className="text-gray-400 mt-2">You've minted the maximum of {MINT_CONFIG.MAX_PER_WALLET} artifacts</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <Info className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <p className="text-lg font-bold text-white mb-2">Connect Wallet to Mint</p>
              <p className="text-gray-400">Please connect your wallet to participate in the public mint</p>
            </div>
          )}

          {/* Info Section */}
          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-sm font-bold text-gray-400 mb-3">MINT DETAILS</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Price per NFT:</span>
                <span className="text-gray-300">{MINT_CONFIG.PRICE_PER_NFT} SUI</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Max per transaction:</span>
                <span className="text-gray-300">{MINT_CONFIG.MAX_PER_TX}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Max per wallet:</span>
                <span className="text-gray-300">{MINT_CONFIG.MAX_PER_WALLET}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Total supply:</span>
                <span className="text-gray-300">{CONTRACT_CONSTANTS.ARTIFACT_SUPPLY.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}