'use client';

import { useState } from 'react';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CONTRACT_CONSTANTS, REVENUE_CONFIG } from '@/constants/contract';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { FlaskConical, Loader2 } from 'lucide-react';

export function MintNFT() {
  const [isMinting, setIsMinting] = useState(false);
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  
  // Check if current account is admin (you might want to verify AdminCap ownership instead)
  const isAdmin = account?.address && (
    account.address === REVENUE_CONFIG.DEV_ADDRESS ||
    account.address === REVENUE_CONFIG.FOUNDER_ADDRESS ||
    account.address === REVENUE_CONFIG.DEPLOYER_ADDRESS
  );

  if (!isAdmin) {
    return null;
  }

  const handleMint = async () => {
    setIsMinting(true);
    try {
      const tx = new Transaction();
      
      // For testing, we'll use the admin cap ID directly
      // In production, you should fetch the actual admin cap owned by the user
      const adminCapId = account.address === REVENUE_CONFIG.DEV_ADDRESS 
        ? CONTRACT_CONSTANTS.DEV_ADMIN_CAP_ID 
        : CONTRACT_CONSTANTS.FOUNDER_ADMIN_CAP_ID;
      
      const [nft] = tx.moveCall({
        target: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.MODULE_NAME}::${CONTRACT_CONSTANTS.FUNCTIONS.MINT_ARTIFACT}`,
        arguments: [
          tx.object(adminCapId),
          tx.object(CONTRACT_CONSTANTS.GLOBAL_STATS_ID),
        ],
      });

      // Transfer the minted NFT to the sender
      tx.transferObjects([nft], tx.pure.address(account.address));

      const result = await signAndExecute({
        transaction: tx,
      });

      toast.success('NFT minted successfully!', {
        description: 'New SUDOZ ARTIFACT has been created',
      });

      // Trigger a refetch of NFTs
      setTimeout(() => {
        window.dispatchEvent(new Event('nft-updated'));
      }, 1000);
    } catch (error) {
      console.error('Minting failed:', error);
      toast.error('Failed to mint NFT', {
        description: 'Please check console for details',
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Card className="bg-black/50 border-green-400/30">
      <CardContent className="p-4">
        <Button
          onClick={handleMint}
          disabled={isMinting}
          className="w-full bg-green-400 hover:bg-green-500 text-black font-bold"
        >
          {isMinting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Minting...
            </>
          ) : (
            <>
              <FlaskConical className="w-4 h-4 mr-2" />
              Mint Test NFT (Admin Only)
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}