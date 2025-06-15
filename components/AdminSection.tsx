'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { bcs } from '@mysten/sui/bcs';
import { CONTRACT_CONSTANTS, REVENUE_CONFIG } from '@/constants/contract';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ensureKiosk } from '@/utils/kioskUtils';
import { 
  Shield, 
  Coins, 
  FlaskConical, 
  Sparkles, 
  DollarSign,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Zap,
  Activity
} from 'lucide-react';

export function AdminSection() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [hasAdminCap, setHasAdminCap] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [adminCapId, setAdminCapId] = useState<string | null>(null);
  const [hasEvolvedAdminCap, setHasEvolvedAdminCap] = useState(false);
  const [evolvedAdminCapId, setEvolvedAdminCapId] = useState<string | null>(null);
  const [isMintingDevReserve, setIsMintingDevReserve] = useState(false);
  const [selectedOneOfOne, setSelectedOneOfOne] = useState<number>(CONTRACT_CONSTANTS.ONE_OF_ONE_IDS[0]);
  const [isWithdrawingRoyalties, setIsWithdrawingRoyalties] = useState(false);
  const [mintBatchSize, setMintBatchSize] = useState<number>(1);

  // Check if current account owns the AdminCap
  const { data: adminCapData } = useSuiClientQuery('getOwnedObjects', {
    owner: account?.address || '',
    filter: {
      StructType: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.MODULE_NAME}::AdminCap`,
    },
  }, {
    enabled: !!account,
  });

  // Check if current account owns the EvolvedAdminCap
  const { data: evolvedAdminCapData } = useSuiClientQuery('getOwnedObjects', {
    owner: account?.address || '',
    filter: {
      StructType: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.EVOLVED_MODULE_NAME}::EvolvedAdminCap`,
    },
  }, {
    enabled: !!account && CONTRACT_CONSTANTS.EVOLVED_ADMIN_CAP_ID !== '',
  });

  // Fetch global stats to show accumulated fees
  const { data: statsData, refetch: refetchStats } = useSuiClientQuery('getObject', {
    id: CONTRACT_CONSTANTS.GLOBAL_STATS_ID,
    options: {
      showContent: true,
    },
  });

  // Fetch evolved stats if available
  const { data: evolvedStatsData, refetch: refetchEvolvedStats } = useSuiClientQuery('getObject', {
    id: CONTRACT_CONSTANTS.EVOLVED_STATS_ID,
    options: {
      showContent: true,
    },
  }, {
    enabled: CONTRACT_CONSTANTS.EVOLVED_STATS_ID !== '',
  });

  useEffect(() => {
    if (adminCapData?.data && adminCapData.data.length > 0) {
      setHasAdminCap(true);
      const adminCap = adminCapData.data[0];
      const capId = adminCap.data?.objectId || null;
      setAdminCapId(capId);
    } else if (account?.address === REVENUE_CONFIG.FOUNDER_ADDRESS && CONTRACT_CONSTANTS.FOUNDER_ADMIN_CAP_ID) {
      setHasAdminCap(true);
      setAdminCapId(CONTRACT_CONSTANTS.FOUNDER_ADMIN_CAP_ID);
    } else if (account?.address === REVENUE_CONFIG.DEV_ADDRESS && CONTRACT_CONSTANTS.DEV_ADMIN_CAP_ID) {
      setHasAdminCap(true);
      setAdminCapId(CONTRACT_CONSTANTS.DEV_ADMIN_CAP_ID);
    } else {
      setHasAdminCap(false);
      setAdminCapId(null);
    }
  }, [adminCapData, account]);

  useEffect(() => {
    if (evolvedAdminCapData?.data && evolvedAdminCapData.data.length > 0) {
      setHasEvolvedAdminCap(true);
      const evolvedCap = evolvedAdminCapData.data[0];
      const capId = evolvedCap.data?.objectId || null;
      setEvolvedAdminCapId(capId);
    } else if (account?.address === REVENUE_CONFIG.FOUNDER_ADDRESS && CONTRACT_CONSTANTS.FOUNDER_EVOLVED_ADMIN_CAP_ID) {
      setHasEvolvedAdminCap(true);
      setEvolvedAdminCapId(CONTRACT_CONSTANTS.FOUNDER_EVOLVED_ADMIN_CAP_ID);
    } else if (account?.address === REVENUE_CONFIG.DEV_ADDRESS && CONTRACT_CONSTANTS.EVOLVED_ADMIN_CAP_ID) {
      setHasEvolvedAdminCap(true);
      setEvolvedAdminCapId(CONTRACT_CONSTANTS.EVOLVED_ADMIN_CAP_ID);
    } else {
      setHasEvolvedAdminCap(false);
      setEvolvedAdminCapId(null);
    }
  }, [evolvedAdminCapData, account]);

  // Auto-refresh stats every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchStats();
      if (evolvedStatsData) refetchEvolvedStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [refetchStats, refetchEvolvedStats, evolvedStatsData]);

  if (!hasAdminCap && !hasEvolvedAdminCap) {
    return null;
  }

  const stats = statsData?.data?.content && 'fields' in statsData.data.content 
    ? statsData.data.content.fields as any
    : null;

  const evolvedStats = evolvedStatsData?.data?.content && 'fields' in evolvedStatsData.data.content
    ? evolvedStatsData.data.content.fields as any
    : null;

  const founderPoolBalance = stats?.founder_pool?.fields?.balance || '0';
  const devPoolBalance = stats?.dev_pool?.fields?.balance || '0';
  const artifactsMinted = stats?.artifacts_minted || '0';
  const artifactsBurned = stats?.artifacts_burned || '0';
  const evolvedMinted = evolvedStats?.evolved_minted || '0';
  const royaltyBalance = evolvedStats?.royalty_balance?.fields?.balance || '0';

  // Convert balances to SUI
  const founderPoolInSui = Number(founderPoolBalance) / 1_000_000_000;
  const devPoolInSui = Number(devPoolBalance) / 1_000_000_000;
  const royaltyInSui = Number(royaltyBalance) / 1_000_000_000;

  // Check if current user is dev or founder
  const isDev = account?.address === REVENUE_CONFIG.DEV_ADDRESS;
  const isFounder = account?.address === REVENUE_CONFIG.FOUNDER_ADDRESS;

  const handleMintArtifact = async () => {
    if (!adminCapId) return;
    
    setIsMinting(true);
    try {
      const tx = new Transaction();
      
      tx.moveCall({
        target: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.MODULE_NAME}::${CONTRACT_CONSTANTS.FUNCTIONS.MINT_ARTIFACT}`,
        arguments: [
          tx.object(adminCapId),
          tx.pure.address(account?.address || ''),
          tx.object(CONTRACT_CONSTANTS.GLOBAL_STATS_ID),
        ],
      });

      const result = await signAndExecute({
        transaction: tx,
      });

      toast.success('Artifact minted successfully!', {
        description: `Transaction: ${result.digest}`,
        action: {
          label: 'View on Explorer',
          onClick: () => window.open(`https://suivision.xyz/txblock/${result.digest}`, '_blank'),
        },
      });

      setTimeout(() => {
        refetchStats();
        window.dispatchEvent(new Event('nft-updated'));
      }, 2000);
    } catch (error) {
      console.error('Minting failed:', error);
      toast.error('Failed to mint artifact', {
        description: 'Please try again',
      });
    } finally {
      setIsMinting(false);
    }
  };

  const handleWithdrawFounderFees = async () => {
    if (!isFounder || founderPoolInSui <= 0) return;

    setIsWithdrawing(true);
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.MODULE_NAME}::withdraw_founder_pool`,
        arguments: [
          tx.object(adminCapId!),
          tx.object(CONTRACT_CONSTANTS.GLOBAL_STATS_ID),
        ],
      });

      const result = await signAndExecute({
        transaction: tx,
      });

      toast.success(`Withdrew ${founderPoolInSui.toFixed(2)} SUI from founder pool!`, {
        description: `Transaction: ${result.digest}`,
        action: {
          label: 'View on Explorer',
          onClick: () => window.open(`https://suivision.xyz/txblock/${result.digest}`, '_blank'),
        },
      });

      setTimeout(() => refetchStats(), 2000);
    } catch (error) {
      console.error('Withdrawal failed:', error);
      toast.error('Failed to withdraw founder fees', {
        description: 'Please try again',
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleWithdrawDevFees = async () => {
    if (!isDev || devPoolInSui <= 0) return;

    setIsWithdrawing(true);
    try {
      const tx = new Transaction();

      // Dev withdrawal doesn't need AdminCap
      tx.moveCall({
        target: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.MODULE_NAME}::withdraw_dev_pool`,
        arguments: [
          tx.object(CONTRACT_CONSTANTS.GLOBAL_STATS_ID),
        ],
      });

      const result = await signAndExecute({
        transaction: tx,
      });

      toast.success(`Withdrew ${devPoolInSui.toFixed(2)} SUI from dev pool!`, {
        description: `Transaction: ${result.digest}`,
        action: {
          label: 'View on Explorer',
          onClick: () => window.open(`https://suivision.xyz/txblock/${result.digest}`, '_blank'),
        },
      });

      setTimeout(() => refetchStats(), 2000);
    } catch (error) {
      console.error('Withdrawal failed:', error);
      toast.error('Failed to withdraw dev fees', {
        description: 'Please try again',
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleWithdrawRoyalties = async () => {
    if (!evolvedAdminCapId || royaltyInSui <= 0) return;
    
    setIsWithdrawingRoyalties(true);
    try {
      const tx = new Transaction();
      
      const [royaltyCoin] = tx.moveCall({
        target: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.EVOLVED_MODULE_NAME}::withdraw_royalty_fees`,
        arguments: [
          tx.object(evolvedAdminCapId),
          tx.object(CONTRACT_CONSTANTS.EVOLVED_STATS_ID),
        ],
      });

      tx.transferObjects([royaltyCoin], tx.pure.address(account?.address || ''));

      const result = await signAndExecute({
        transaction: tx,
      });

      toast.success(`Withdrew ${royaltyInSui.toFixed(2)} SUI in royalties!`, {
        description: `Transaction: ${result.digest}`,
        action: {
          label: 'View on Explorer',
          onClick: () => window.open(`https://suivision.xyz/txblock/${result.digest}`, '_blank'),
        },
      });

      setTimeout(() => refetchEvolvedStats(), 2000);
    } catch (error) {
      console.error('Royalty withdrawal failed:', error);
      toast.error('Failed to withdraw royalties', {
        description: 'Please try again',
      });
    } finally {
      setIsWithdrawingRoyalties(false);
    }
  };

  const handleMintOneOfOne = async () => {
    if (!evolvedAdminCapId) return;
    
    setIsMintingDevReserve(true);
    try {
      // Fetch metadata from IPFS
      const metadataUrl = `https://ipfs.io/ipfs/bafybeic7ymazpspv6ojxwrr6rqu3glnrtzbj3ej477nowr73brmb4hkkka/metadata/${selectedOneOfOne}.json`;
      const response = await fetch(metadataUrl);
      const metadata = await response.json();
      
      // Extract traits
      const traitsMap = new Map<string, string>();
      metadata.attributes.forEach((attr: any) => {
        traitsMap.set(attr.trait_type.toLowerCase(), attr.value);
      });
      
      const traits = {
        background: traitsMap.get('background') || 'AI Generated',
        skin: traitsMap.get('skin') || '1/1 Exclusive',
        clothes: traitsMap.get('clothes') || 'Special Edition',
        hats: traitsMap.get('hats') || 'One of One',
        eyewear: traitsMap.get('eyewear') || 'Unique',
        mouth: traitsMap.get('mouth') || 'Limited',
        earrings: traitsMap.get('earrings') || 'AI 1/1S',
      };

      const tx = new Transaction();
      
      // Ensure kiosk exists
      const kioskInfo = await ensureKiosk(client, account?.address || '', tx);
      
      // Mint to kiosk
      tx.moveCall({
        target: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.EVOLVED_MODULE_NAME}::${CONTRACT_CONSTANTS.FUNCTIONS.MINT_DEVELOPER_RESERVE_TO_KIOSK}`,
        arguments: [
          tx.object(evolvedAdminCapId),
          kioskInfo.kioskId,
          kioskInfo.kioskCap,
          tx.pure.u64(selectedOneOfOne),
          tx.pure.string(traits.background),
          tx.pure.string(traits.skin),
          tx.pure.string(traits.clothes),
          tx.pure.string(traits.hats),
          tx.pure.string(traits.eyewear),
          tx.pure.string(traits.mouth),
          tx.pure.string(traits.earrings),
          tx.object(CONTRACT_CONSTANTS.EVOLVED_STATS_ID),
        ],
      });
      
      if (kioskInfo.isNew) {
        // Share the kiosk
        tx.moveCall({
          target: '0x2::transfer::public_share_object',
          arguments: [kioskInfo.kioskId],
          typeArguments: ['0x2::kiosk::Kiosk'],
        });
        
        // Transfer cap to user
        tx.moveCall({
          target: '0x2::transfer::public_transfer',
          arguments: [kioskInfo.kioskCap, tx.pure.address(account?.address || '')],
          typeArguments: ['0x2::kiosk::KioskOwnerCap'],
        });
      }

      const result = await signAndExecute({
        transaction: tx,
      });

      toast.success(`Minted 1/1 NFT #${selectedOneOfOne}!`, {
        description: `Transaction: ${result.digest}`,
        action: {
          label: 'View on Explorer',
          onClick: () => window.open(`https://suivision.xyz/txblock/${result.digest}`, '_blank'),
        },
      });

      setTimeout(() => {
        refetchEvolvedStats();
        window.dispatchEvent(new Event('nft-updated'));
      }, 2000);
    } catch (error) {
      console.error('1/1 minting failed:', error);
      toast.error('Failed to mint 1/1 NFT', {
        description: 'This NFT might already be minted',
      });
    } finally {
      setIsMintingDevReserve(false);
    }
  };

  const handleMintRandomBatch = async () => {
    if (!evolvedAdminCapId || mintBatchSize < 1 || mintBatchSize > 10) return;

    setIsMintingDevReserve(true);
    try {
      // Get available metadata IDs
      const evolvedStatsObj = await client.getObject({
        id: CONTRACT_CONSTANTS.EVOLVED_STATS_ID,
        options: { showContent: true }
      });
      
      const availableIds = (evolvedStatsObj.data?.content as any)?.fields?.available_metadata_ids || [];
      
      if (availableIds.length === 0) {
        toast.error('No metadata IDs available!');
        return;
      }

      // For each NFT in the batch
      for (let i = 0; i < mintBatchSize; i++) {
        const randomMetadataId = availableIds[Math.floor(Math.random() * availableIds.length)];
        
        // Fetch metadata
        const metadataUrl = `https://ipfs.io/ipfs/bafybeic7ymazpspv6ojxwrr6rqu3glnrtzbj3ej477nowr73brmb4hkkka/metadata/${randomMetadataId}.json`;
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

        const tx = new Transaction();
        
        // Ensure kiosk exists
        const kioskInfo = await ensureKiosk(client, account?.address || '', tx);
        
        // Mint to kiosk
        tx.moveCall({
          target: `${CONTRACT_CONSTANTS.PACKAGE_ID}::${CONTRACT_CONSTANTS.EVOLVED_MODULE_NAME}::${CONTRACT_CONSTANTS.FUNCTIONS.MINT_DEVELOPER_RESERVE_TO_KIOSK}`,
          arguments: [
            tx.object(evolvedAdminCapId),
            kioskInfo.kioskId,
            kioskInfo.kioskCap,
            tx.pure.u64(randomMetadataId),
            tx.pure.string(traits.background),
            tx.pure.string(traits.skin),
            tx.pure.string(traits.clothes),
            tx.pure.string(traits.hats),
            tx.pure.string(traits.eyewear),
            tx.pure.string(traits.mouth),
            tx.pure.string(traits.earrings),
            tx.object(CONTRACT_CONSTANTS.EVOLVED_STATS_ID),
          ],
        });
        
        if (kioskInfo.isNew) {
          // Share the kiosk
          tx.moveCall({
            target: '0x2::transfer::public_share_object',
            arguments: [kioskInfo.kioskId],
            typeArguments: ['0x2::kiosk::Kiosk'],
          });
          
          // Transfer cap to user
          tx.moveCall({
            target: '0x2::transfer::public_transfer',
            arguments: [kioskInfo.kioskCap, tx.pure.address(account?.address || '')],
            typeArguments: ['0x2::kiosk::KioskOwnerCap'],
          });
        }

        const result = await signAndExecute({
          transaction: tx,
        });

        toast.success(`Minted random NFT #${randomMetadataId}!`, {
          description: `${i + 1}/${mintBatchSize} minted`,
        });
      }

      setTimeout(() => {
        refetchEvolvedStats();
        window.dispatchEvent(new Event('nft-updated'));
      }, 2000);
    } catch (error) {
      console.error('Random batch minting failed:', error);
      toast.error('Failed to mint random NFTs');
    } finally {
      setIsMintingDevReserve(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Admin Header */}
      <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-400/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-yellow-400" />
              <CardTitle className="text-2xl text-yellow-400">Admin Dashboard</CardTitle>
            </div>
            <Badge className="bg-yellow-400 text-black font-bold">
              {isDev ? 'DEV' : isFounder ? 'FOUNDER' : 'ADMIN'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-black/50 border-green-400/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <FlaskConical className="w-5 h-5 text-green-400" />
              <span className="text-xs text-green-400">MINTED</span>
            </div>
            <div className="text-2xl font-bold text-white">{artifactsMinted}</div>
            <p className="text-xs text-gray-400 mt-1">of {CONTRACT_CONSTANTS.ARTIFACT_SUPPLY}</p>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-purple-400/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-purple-400">EVOLVED</span>
            </div>
            <div className="text-2xl font-bold text-white">{evolvedMinted}</div>
            <p className="text-xs text-gray-400 mt-1">of {CONTRACT_CONSTANTS.EVOLVED_SUPPLY}</p>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-orange-400/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Coins className="w-5 h-5 text-orange-400" />
              <span className="text-xs text-orange-400">FOUNDER</span>
            </div>
            <div className="text-2xl font-bold text-white">{founderPoolInSui.toFixed(2)}</div>
            <p className="text-xs text-gray-400 mt-1">SUI Available</p>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-cyan-400/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Coins className="w-5 h-5 text-cyan-400" />
              <span className="text-xs text-cyan-400">DEV</span>
            </div>
            <div className="text-2xl font-bold text-white">{devPoolInSui.toFixed(2)}</div>
            <p className="text-xs text-gray-400 mt-1">SUI Available</p>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-yellow-400/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-yellow-400" />
              <span className="text-xs text-yellow-400">ROYALTIES</span>
            </div>
            <div className="text-2xl font-bold text-white">{royaltyInSui.toFixed(2)}</div>
            <p className="text-xs text-gray-400 mt-1">SUI Available</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <Tabs defaultValue="minting" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900 border-gray-700">
          <TabsTrigger value="minting" className="data-[state=active]:bg-green-400 data-[state=active]:text-black">
            Minting
          </TabsTrigger>
          <TabsTrigger value="fees" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
            Fee Withdrawal
          </TabsTrigger>
          <TabsTrigger value="royalties" className="data-[state=active]:bg-purple-400 data-[state=active]:text-black">
            Royalties
          </TabsTrigger>
        </TabsList>

        {/* Minting Tab */}
        <TabsContent value="minting" className="mt-6 space-y-4">
          {hasAdminCap && (
            <Card className="bg-black/50 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-green-400">Mint SUDOZ Artifacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-400 text-sm">
                  Mint new SUDOZ ARTIFACT NFTs. Each artifact starts at level 0.
                </p>
                <Button
                  onClick={handleMintArtifact}
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
                      Mint Artifact
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {hasEvolvedAdminCap && (
            <>
              <Card className="bg-black/50 border-purple-400/30">
                <CardHeader>
                  <CardTitle className="text-purple-400">Mint 1/1 Developer Reserve</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-400 text-sm">
                    Mint specific 1/1 NFTs from the developer reserve.
                  </p>
                  <Select 
                    value={selectedOneOfOne.toString()} 
                    onValueChange={(value) => setSelectedOneOfOne(parseInt(value))}
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                      <SelectValue placeholder="Select 1/1 NFT" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      {CONTRACT_CONSTANTS.ONE_OF_ONE_IDS.map((id) => (
                        <SelectItem key={id} value={id.toString()} className="text-white">
                          1/1 NFT #{id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleMintOneOfOne}
                    disabled={isMintingDevReserve}
                    className="w-full bg-purple-400 hover:bg-purple-500 text-black font-bold"
                  >
                    {isMintingDevReserve ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Minting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Mint 1/1 #{selectedOneOfOne}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-purple-400/30">
                <CardHeader>
                  <CardTitle className="text-purple-400">Mint Random Batch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-400 text-sm">
                    Mint random NFTs from available developer reserve.
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">Batch size:</span>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={mintBatchSize}
                      onChange={(e) => setMintBatchSize(parseInt(e.target.value) || 1)}
                      className="w-20 bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                  <Button
                    onClick={handleMintRandomBatch}
                    disabled={isMintingDevReserve}
                    className="w-full bg-purple-400 hover:bg-purple-500 text-black font-bold"
                  >
                    {isMintingDevReserve ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Minting...
                      </>
                    ) : (
                      <>
                        <Activity className="w-4 h-4 mr-2" />
                        Mint {mintBatchSize} Random NFT{mintBatchSize > 1 ? 's' : ''}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Fee Withdrawal Tab */}
        <TabsContent value="fees" className="mt-6">
          <Card className="bg-black/50 border-cyan-400/30">
            <CardHeader>
              <CardTitle className="text-cyan-400">Upgrade Fee Pools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-sm mb-1">Founder Pool (85%)</p>
                  <p className="text-xl font-bold text-white">{founderPoolInSui.toFixed(2)} SUI</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-sm mb-1">Dev Pool (15%)</p>
                  <p className="text-xl font-bold text-white">{devPoolInSui.toFixed(2)} SUI</p>
                </div>
              </div>
              
              {isFounder && (
                <Button
                  onClick={handleWithdrawFounderFees}
                  disabled={isWithdrawing || founderPoolInSui <= 0}
                  className="w-full bg-orange-400 hover:bg-orange-500 text-black font-bold"
                >
                  {isWithdrawing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Withdrawing...
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4 mr-2" />
                      Withdraw Founder Pool ({founderPoolInSui.toFixed(2)} SUI)
                    </>
                  )}
                </Button>
              )}
              
              {isDev && (
                <Button
                  onClick={handleWithdrawDevFees}
                  disabled={isWithdrawing || devPoolInSui <= 0}
                  className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-bold"
                >
                  {isWithdrawing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Withdrawing...
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4 mr-2" />
                      Withdraw Dev Pool ({devPoolInSui.toFixed(2)} SUI)
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Royalties Tab */}
        <TabsContent value="royalties" className="mt-6">
          <Card className="bg-black/50 border-purple-400/30">
            <CardHeader>
              <CardTitle className="text-purple-400">Marketplace Royalties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Available Royalties</p>
                <p className="text-2xl font-bold text-white">{royaltyInSui.toFixed(2)} SUI</p>
                <p className="text-xs text-gray-400 mt-2">
                  3% royalties from secondary sales
                </p>
              </div>
              
              <Button
                onClick={handleWithdrawRoyalties}
                disabled={isWithdrawingRoyalties || royaltyInSui <= 0}
                className="w-full bg-purple-400 hover:bg-purple-500 text-black font-bold"
              >
                {isWithdrawingRoyalties ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Withdrawing...
                  </>
                ) : (
                  <>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Withdraw Royalties ({royaltyInSui.toFixed(2)} SUI)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}