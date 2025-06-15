'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { getUserKiosks, KioskInfo } from '@/utils/kioskUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, ExternalLink, RefreshCw, Loader2, Package } from 'lucide-react';

export function KioskManager() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [kiosks, setKiosks] = useState<KioskInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchKiosks = async () => {
    if (!account?.address) return;
    
    setLoading(true);
    try {
      const userKiosks = await getUserKiosks(client, account.address);
      setKiosks(userKiosks);
    } catch (error) {
      console.error('Error fetching kiosks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKiosks();
  }, [account]);

  // Listen for NFT updates
  useEffect(() => {
    const handleUpdate = () => {
      fetchKiosks();
    };

    window.addEventListener('nft-updated', handleUpdate);
    return () => window.removeEventListener('nft-updated', handleUpdate);
  }, [account]);

  if (!account) return null;

  if (kiosks.length === 0 && !loading) {
    return null; // Don't show anything if user has no kiosks
  }

  return (
    <Card className="bg-black/50 border-green-400/30 mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Store className="w-6 h-6 text-green-400" />
            <CardTitle className="text-green-400">Your Kiosks</CardTitle>
          </div>
          <Button
            onClick={fetchKiosks}
            disabled={loading}
            size="sm"
            variant="outline"
            className="border-green-400 text-green-400 hover:bg-green-400/10"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && kiosks.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {kiosks.map((kiosk, index) => (
              <div
                key={kiosk.kioskId}
                className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 hover:border-green-400/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-white font-medium">Kiosk #{index + 1}</p>
                      <p className="text-xs text-gray-400 font-mono">{kiosk.kioskId.slice(0, 16)}...</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary" className="bg-green-400/20 text-green-400">
                      {kiosk.items} items
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-green-400 hover:text-green-300"
                      onClick={() => window.open(`https://suivision.xyz/object/${kiosk.kioskId}`, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}