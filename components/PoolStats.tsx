'use client';

import { useEffect } from 'react';
import { useSuiClientQuery } from '@mysten/dapp-kit';
import { CONTRACT_CONSTANTS, REVENUE_CONFIG } from '@/constants/contract';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Coins, 
  TrendingUp, 
  Users,
  PieChart,
  DollarSign,
  Activity,
  Info,
  RefreshCw
} from 'lucide-react';

export function PoolStats() {
  // Fetch global stats for pool balances
  const { data: statsData, refetch: refetchStats } = useSuiClientQuery('getObject', {
    id: CONTRACT_CONSTANTS.GLOBAL_STATS_ID,
    options: {
      showContent: true,
    },
  });

  // Fetch evolved stats for royalty balance
  const { data: evolvedStatsData, refetch: refetchEvolvedStats } = useSuiClientQuery('getObject', {
    id: CONTRACT_CONSTANTS.EVOLVED_STATS_ID,
    options: {
      showContent: true,
    },
  }, {
    enabled: CONTRACT_CONSTANTS.EVOLVED_STATS_ID !== '',
  });

  // Auto-refresh stats every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchStats();
      if (evolvedStatsData) refetchEvolvedStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [refetchStats, refetchEvolvedStats, evolvedStatsData]);

  const stats = statsData?.data?.content && 'fields' in statsData.data.content 
    ? statsData.data.content.fields as any
    : null;

  const evolvedStats = evolvedStatsData?.data?.content && 'fields' in evolvedStatsData.data.content
    ? evolvedStatsData.data.content.fields as any
    : null;

  // Extract balances
  const founderPoolBalance = stats?.founder_pool?.fields?.balance || '0';
  const devPoolBalance = stats?.dev_pool?.fields?.balance || '0';
  const royaltyBalance = evolvedStats?.royalty_balance?.fields?.balance || '0';

  // Convert to SUI
  const founderPoolInSui = Number(founderPoolBalance) / 1_000_000_000;
  const devPoolInSui = Number(devPoolBalance) / 1_000_000_000;
  const royaltyInSui = Number(royaltyBalance) / 1_000_000_000;
  const totalInSui = founderPoolInSui + devPoolInSui + royaltyInSui;

  // Calculate percentages
  const founderPercentage = totalInSui > 0 ? (founderPoolInSui / totalInSui) * 100 : 0;
  const devPercentage = totalInSui > 0 ? (devPoolInSui / totalInSui) * 100 : 0;
  const royaltyPercentage = totalInSui > 0 ? (royaltyInSui / totalInSui) * 100 : 0;

  // Get other stats
  const artifactsMinted = parseInt(stats?.artifacts_minted || '0');
  const artifactsBurned = parseInt(stats?.artifacts_burned || '0');
  const evolvedMinted = parseInt(evolvedStats?.evolved_minted || '0');
  const level10Burns = parseInt(stats?.level_10_burns || '0');

  return (
    <div className="w-full space-y-6">
      {/* Pool Overview Header */}
      <Card className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-cyan-400/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <PieChart className="w-6 h-6 text-cyan-400" />
              <CardTitle className="text-2xl text-cyan-400">Revenue Pool Analytics</CardTitle>
            </div>
            <Badge className="bg-cyan-400 text-black">
              MAINNET
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Total Value Locked */}
      <Card className="bg-black/50 border-green-400/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Total Value Locked</h3>
              <p className="text-sm text-gray-400">Across all pools</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
          <div className="text-4xl font-bold text-green-400 mb-2">
            {totalInSui.toFixed(2)} SUI
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Activity className="w-4 h-4" />
            <span>Real-time balance</span>
          </div>
        </CardContent>
      </Card>

      {/* Individual Pool Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Founder Pool */}
        <Card className="bg-black/50 border-orange-400/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-orange-400">Founder Pool</h3>
              <Badge className="bg-orange-400/20 text-orange-400">85%</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-2xl font-bold text-white">{founderPoolInSui.toFixed(2)} SUI</div>
              <p className="text-xs text-gray-400 mt-1">
                Balance: {founderPoolBalance} MIST
              </p>
            </div>
            <Progress value={founderPercentage} className="h-2" />
            <div className="pt-2 border-t border-gray-700">
              <p className="text-xs text-gray-400 mb-2">Pool Address:</p>
              <code className="text-xs text-orange-400 font-mono break-all">
                {REVENUE_CONFIG.FOUNDER_ADDRESS}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Dev Pool */}
        <Card className="bg-black/50 border-cyan-400/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-cyan-400">Dev Pool</h3>
              <Badge className="bg-cyan-400/20 text-cyan-400">15%</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-2xl font-bold text-white">{devPoolInSui.toFixed(2)} SUI</div>
              <p className="text-xs text-gray-400 mt-1">
                Balance: {devPoolBalance} MIST
              </p>
            </div>
            <Progress value={devPercentage} className="h-2" />
            <div className="pt-2 border-t border-gray-700">
              <p className="text-xs text-gray-400 mb-2">Pool Address:</p>
              <code className="text-xs text-cyan-400 font-mono break-all">
                {REVENUE_CONFIG.DEV_ADDRESS}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Royalty Pool */}
        <Card className="bg-black/50 border-purple-400/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-purple-400">Royalty Pool</h3>
              <Badge className="bg-purple-400/20 text-purple-400">3%</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-2xl font-bold text-white">{royaltyInSui.toFixed(2)} SUI</div>
              <p className="text-xs text-gray-400 mt-1">
                Balance: {royaltyBalance} MIST
              </p>
            </div>
            <Progress value={royaltyPercentage} className="h-2" />
            <div className="text-xs text-gray-400 pt-2 border-t border-gray-700">
              <p>From secondary market trades</p>
              <p className="mt-1">Accumulated from {evolvedMinted} evolved NFTs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Split Visualization */}
      <Card className="bg-black/50 border-gray-600">
        <CardHeader>
          <h3 className="text-lg font-bold text-white">Revenue Distribution Model</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-sm font-bold text-gray-400 mb-2">UPGRADE FEES</h4>
                <div className="space-y-2">
                  
                </div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-sm font-bold text-gray-400 mb-2">MARKETPLACE ROYALTIES</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Collection Royalty</span>
                    <span className="text-sm font-mono text-purple-400">3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Accumulated</span>
                    <span className="text-sm font-mono text-purple-400">{royaltyInSui.toFixed(2)} SUI</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-400/30">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                <div className="text-sm text-gray-300">
                  <p className="font-bold text-blue-400 mb-1">Pool Security</p>
                  <p>• Dev pool is protected and never used for refunds</p>
                  <p>• Founder pool handles all refund operations</p>
                  <p>• Withdrawals require authorized addresses</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collection Metrics */}
      <Card className="bg-black/50 border-gray-600">
        <CardHeader>
          <h3 className="text-lg font-bold text-white">Collection Metrics</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{artifactsMinted}</div>
              <p className="text-xs text-gray-400 mt-1">Artifacts Minted</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{artifactsBurned}</div>
              <p className="text-xs text-gray-400 mt-1">Artifacts Burned</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{evolvedMinted}</div>
              <p className="text-xs text-gray-400 mt-1">Evolved NFTs</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{level10Burns}</div>
              <p className="text-xs text-gray-400 mt-1">Level 10 Burns</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pool Addresses Reference */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <h3 className="text-sm font-bold text-gray-400">POOL ADDRESSES</h3>
        </CardHeader>
        <CardContent className="space-y-3 font-mono text-xs">
          <div>
            <p className="text-gray-500 mb-1">Founder Address:</p>
            <p className="text-gray-300 break-all">{REVENUE_CONFIG.FOUNDER_ADDRESS}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Developer Address:</p>
            <p className="text-gray-300 break-all">{REVENUE_CONFIG.DEV_ADDRESS}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Deployer Address:</p>
            <p className="text-gray-300 break-all">{REVENUE_CONFIG.DEPLOYER_ADDRESS}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}