'use client';

import { useSuiClientQuery } from '@mysten/dapp-kit';
import { CONTRACT_CONSTANTS } from '@/constants/contract';
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Activity, TrendingUp, Zap } from 'lucide-react';

export function EvolvedStats() {
  // Fetch evolved stats
  const { data: evolvedStatsData, refetch } = useSuiClientQuery('getObject', {
    id: CONTRACT_CONSTANTS.EVOLVED_STATS_ID,
    options: {
      showContent: true,
    },
  }, {
    enabled: CONTRACT_CONSTANTS.EVOLVED_STATS_ID !== '',
  });

  // Fetch global stats for artifacts
  const { data: globalStatsData, refetch: refetchGlobal } = useSuiClientQuery('getObject', {
    id: CONTRACT_CONSTANTS.GLOBAL_STATS_ID,
    options: {
      showContent: true,
    },
  }, {
    enabled: CONTRACT_CONSTANTS.GLOBAL_STATS_ID !== '',
  });

  // Also refetch when NFTs are updated
  useEffect(() => {
    const handleUpdate = () => {
      refetch();
      refetchGlobal();
    };

    window.addEventListener('nft-updated', handleUpdate);
    return () => window.removeEventListener('nft-updated', handleUpdate);
  }, [refetch, refetchGlobal]);

  if (!evolvedStatsData || !globalStatsData) {
    return null;
  }

  const evolvedMinted = evolvedStatsData.data?.content && 'fields' in evolvedStatsData.data.content 
    ? Number((evolvedStatsData.data.content.fields as any).evolved_minted || 0)
    : 0;

  const artifactsMinted = globalStatsData.data?.content && 'fields' in globalStatsData.data.content
    ? Number((globalStatsData.data.content.fields as any).artifacts_minted || 0)
    : 0;

  const level10Burns = globalStatsData.data?.content && 'fields' in globalStatsData.data.content
    ? Number((globalStatsData.data.content.fields as any).level_10_burns || 0)
    : 0;

  const remaining = CONTRACT_CONSTANTS.EVOLVED_SUPPLY - evolvedMinted;
  const remainingArtifacts = CONTRACT_CONSTANTS.ARTIFACT_SUPPLY - artifactsMinted;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Evolved NFTs Remaining */}
      <Card className="bg-gradient-to-br from-purple-900/50 to-purple-600/20 border-purple-400/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <span className="text-sm text-purple-400">EVOLVED</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {remaining.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-400">
            of {CONTRACT_CONSTANTS.EVOLVED_SUPPLY.toLocaleString()} remaining
          </p>
          <div className="mt-3 text-xs text-purple-300">
            {evolvedMinted} evolved
          </div>
        </CardContent>
      </Card>

      {/* Artifacts Minted */}
      <Card className="bg-gradient-to-br from-green-900/50 to-green-600/20 border-green-400/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-green-400" />
            <span className="text-sm text-green-400">ARTIFACTS</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {artifactsMinted.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-400">
            of {CONTRACT_CONSTANTS.ARTIFACT_SUPPLY.toLocaleString()} minted
          </p>
          <div className="mt-3 text-xs text-green-300">
            {remainingArtifacts} available
          </div>
        </CardContent>
      </Card>

      {/* Evolution Rate */}
      <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-600/20 border-yellow-400/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-yellow-400" />
            <span className="text-sm text-yellow-400">RATE</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {artifactsMinted > 0 ? ((level10Burns / artifactsMinted) * 100).toFixed(1) : '0'}%
          </h3>
          <p className="text-sm text-gray-400">
            Evolution rate
          </p>
          <div className="mt-3 text-xs text-yellow-300">
            {level10Burns} evolved
          </div>
        </CardContent>
      </Card>

      {/* Level 10 Burns */}
      <Card className="bg-gradient-to-br from-red-900/50 to-red-600/20 border-red-400/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-8 h-8 text-red-400" />
            <span className="text-sm text-red-400">BURNED</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {level10Burns.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-400">
            Level 10 burns
          </p>
          <div className="mt-3 text-xs text-red-300">
            For evolution
          </div>
        </CardContent>
      </Card>
    </div>
  );
}