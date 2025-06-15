"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Wallet, Search, Filter, Grid, List, Sparkles, FlaskConical, Zap, AlertTriangle, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { toast } from "sonner";
import WalletConnect from "../components/WalletConnect";
import { useNFTs } from "@/hooks/use-nfts";
import { NFTCard } from "@/components/NFTCard";
import { EvolvedStats } from "@/components/EvolvedStats";
import { EvolvedNFTList } from "@/components/EvolvedNFTList";

export default function EvolveLab() {
  const account = useCurrentAccount();
  const { artifacts, evolvedNFTs, loading, error, refetch } = useNFTs();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("artifacts");

  // Filter functions
  const filteredArtifacts = artifacts.filter((nft) => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.number.toString().includes(searchTerm);
    const matchesLevel = filterLevel === "all" || nft.level.toString() === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const filteredEvolved = evolvedNFTs.filter((nft) => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.number.toString().includes(searchTerm);
    return matchesSearch;
  });

  const totalNFTs = artifacts.length + evolvedNFTs.length;

  if (!account) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/15 rounded-full blur-3xl moving-blur-1"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl moving-blur-2"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-300/8 rounded-full blur-3xl moving-blur-3"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between p-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white tracking-wide">
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK
            </Button>
          </Link>
          <WalletConnect />
        </header>

        {/* Wallet Connection Required */}
        <main className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
            <Wallet className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wider">LABORATORY ACCESS REQUIRED</h2>
          <p className="text-gray-400 mb-8 max-w-2xl text-lg leading-relaxed">
            Connect your wallet to access the SUDOZ Evolution Laboratory and begin genetic evolution protocols.
            Upgrade your artifacts through 10 levels and evolve them into powerful entities.
          </p>
          <WalletConnect />
          
          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl">
            <Card className="bg-black/50 border-green-400/20">
              <CardContent className="p-6 text-center">
                <FlaskConical className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-green-400 font-bold mb-2">UPGRADE SYSTEM</h3>
                <p className="text-gray-400 text-sm">Level up your artifacts using SUI tokens. Each level costs 1 SUI.</p>
              </CardContent>
            </Card>
            <Card className="bg-black/50 border-purple-400/20">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-purple-400 font-bold mb-2">EVOLUTION</h3>
                <p className="text-gray-400 text-sm">Evolve level 10 artifacts into rare Evolved SUDOZ entities.</p>
              </CardContent>
            </Card>
            <Card className="bg-black/50 border-cyan-400/20">
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <h3 className="text-cyan-400 font-bold mb-2">GENETIC PATHS</h3>
                <p className="text-gray-400 text-sm">7 unique evolution paths with distinct visual transformations.</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/15 rounded-full blur-3xl moving-blur-1"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl moving-blur-2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-300/8 rounded-full blur-3xl moving-blur-3"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white tracking-wide">
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK
          </Button>
        </Link>
        <WalletConnect />
      </header>

      <main className="relative z-10 container mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-wider">
            EVOLUTION LABORATORY
          </h1>
          <p className="text-gray-300 text-lg tracking-wide">
            GENETIC MODIFICATION PROTOCOLS ACTIVE
          </p>
        </div>

        {/* Evolved Stats Dashboard */}
        <EvolvedStats />

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-green-400 animate-spin mb-4" />
            <p className="text-green-400 font-bold tracking-wide">SCANNING DNA SEQUENCES...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="w-8 h-8 text-red-400 mb-4" />
            <p className="text-red-400 font-bold tracking-wide">{error}</p>
            <Button 
              onClick={refetch} 
              className="mt-4 bg-green-400 hover:bg-green-500 text-black"
            >
              RETRY SCAN
            </Button>
          </div>
        )}

        {/* No NFTs State */}
        {!loading && !error && totalNFTs === 0 && (
          <div className="text-center py-12">
            <FlaskConical className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">NO SPECIMENS DETECTED</h3>
            <p className="text-gray-400 mb-6">
              No SUDOZ artifacts found in your laboratory. Acquire artifacts to begin genetic experiments.
            </p>
            <Link href="/collection">
              <Button className="bg-green-400 hover:bg-green-500 text-black">
                EXPLORE COLLECTION
              </Button>
            </Link>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && totalNFTs > 0 && (
          <div className="space-y-8">
            {/* Search and Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search artifacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-900 border-gray-700 text-white w-64"
                  />
                </div>
                
                <Select value={filterLevel} onValueChange={setFilterLevel}>
                  <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter Level" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="all" className="text-white">All Levels</SelectItem>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                      <SelectItem key={level} value={level.toString()} className="text-white">
                        Level {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  onClick={refetch}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="border-green-400 text-green-400 hover:bg-green-400/10"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="bg-green-400 hover:bg-green-500 text-black border-green-400"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="bg-green-400 hover:bg-green-500 text-black border-green-400"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Tabs for Artifacts and Evolved */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-900 border-gray-700">
                <TabsTrigger 
                  value="artifacts" 
                  className="data-[state=active]:bg-green-400 data-[state=active]:text-black text-white"
                >
                  ARTIFACTS ({artifacts.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="evolved" 
                  className="data-[state=active]:bg-purple-400 data-[state=active]:text-black text-white"
                >
                  EVOLVED ({evolvedNFTs.length})
                </TabsTrigger>
              </TabsList>

              {/* Artifacts Tab */}
              <TabsContent value="artifacts" className="mt-6">
                {filteredArtifacts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No artifacts match your search criteria.</p>
                  </div>
                ) : (
                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                  }>
                    {filteredArtifacts.map((nft) => (
                      <NFTCard key={nft.objectId} nft={nft} />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Evolved NFTs Tab */}
              <TabsContent value="evolved" className="mt-6">
                <EvolvedNFTList />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
}