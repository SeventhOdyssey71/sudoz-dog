"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Filter, Eye } from "lucide-react"
import Image from "next/image"

// Types
interface SudozTheme {
  name: string
  color: string
  rarity: string
}

interface SudozItem {
  id: number
  name: string
  level: number
  rarity: number
  value: number
  image: string
  theme: SudozTheme
  attributes: string[]
  owner: string
}

// Constants
const SUDOZ_IMAGES = ["/images/sudoz-green.png", "/images/sudoz-purple.png", "/images/sudoz-yellow.png"]

const COLOR_THEMES: SudozTheme[] = [
  { name: "GREEN", color: "green", rarity: "Common" },
  { name: "PURPLE", color: "purple", rarity: "Rare" },
  { name: "YELLOW", color: "yellow", rarity: "Epic" },
  { name: "RED", color: "red", rarity: "Legendary" },
  { name: "BLUE", color: "blue", rarity: "Epic" },
  { name: "CYAN", color: "cyan", rarity: "Rare" },
  { name: "MONOCHROME", color: "gray", rarity: "Mythic" },
  { name: "RAINBOW", color: "rainbow", rarity: "Legendary" },
]

// Utility functions
const getRandomImage = (): string => {
  return SUDOZ_IMAGES[Math.floor(Math.random() * SUDOZ_IMAGES.length)]
}

const getRandomTheme = (): SudozTheme => {
  return COLOR_THEMES[Math.floor(Math.random() * COLOR_THEMES.length)]
}

const getImageFilter = (color: string): string => {
  switch (color) {
    case "red":
      return "hue-rotate(240deg) saturate(1.2)"
    case "blue":
      return "hue-rotate(180deg) saturate(1.1)"
    case "cyan":
      return "hue-rotate(150deg) saturate(1.3)"
    case "gray":
      return "grayscale(1) contrast(1.2)"
    case "rainbow":
      return "hue-rotate(45deg) saturate(1.5) brightness(1.1)"
    default:
      return "none"
  }
}

const getBadgeStyle = (color: string): string => {
  switch (color) {
    case "green":
      return "bg-green-500/20 text-green-400 border-green-400/30"
    case "purple":
      return "bg-purple-500/20 text-purple-400 border-purple-400/30"
    case "yellow":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-400/30"
    case "red":
      return "bg-red-500/20 text-red-400 border-red-400/30"
    case "blue":
      return "bg-blue-500/20 text-blue-400 border-blue-400/30"
    case "cyan":
      return "bg-cyan-500/20 text-cyan-400 border-cyan-400/30"
    case "gray":
      return "bg-gray-500/20 text-gray-400 border-gray-400/30"
    default:
      return "bg-gradient-to-r from-red-500/20 to-purple-500/20 text-white border-white/30"
  }
}

// Components
const CollectionStats = () => (
  <div className="grid grid-cols-4 gap-1.5 md:gap-4 mb-3 md:mb-8">
    {[
      { label: "TOTAL SUPPLY", value: "5,555" },
      { label: "OWNERS", value: "2,847" },
      { label: "FLOOR PRICE", value: "15.2" },
      { label: "VOLUME", value: "84,750" },
    ].map((stat, index) => (
      <Card key={index} className="bg-gray-900/80 border-gray-700">
        <CardContent className="p-1.5 md:p-4 text-center">
          <div className="text-[10px] md:text-2xl font-bold text-white tracking-wider">{stat.value}</div>
          <div className="text-[6px] md:text-sm text-gray-400 tracking-wider">{stat.label}</div>
        </CardContent>
      </Card>
    ))}
  </div>
)

const SudozCard = ({ item }: { item: SudozItem }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Card className="bg-gray-900/80 border-gray-700 cursor-pointer transition-all duration-300 hover:border-green-400/50 hover:shadow-lg hover:shadow-green-400/10 hover:scale-105">
        <CardContent className="p-1 md:p-4">
          <div className="aspect-square mb-1 md:mb-3 relative overflow-hidden rounded-lg">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              fill
              className="object-cover"
              style={{ filter: getImageFilter(item.theme.color) }}
            />
            <div className="absolute top-1 right-1 md:top-2 md:right-2">
              <Badge variant="secondary" className="bg-black/50 text-white text-[6px] md:text-xs tracking-wide">
                #{item.id}
              </Badge>
            </div>
            <div className="absolute top-1 left-1 md:top-2 md:left-2">
              <Badge variant="secondary" className={`text-[6px] md:text-xs tracking-wide ${getBadgeStyle(item.theme.color)}`}>
                {item.theme.name}
              </Badge>
            </div>
          </div>
          <h3 className="font-bold text-white text-[8px] md:text-sm mb-0.5 md:mb-2 tracking-wide truncate">{item.name}</h3>
          <div className="flex justify-between items-center text-[6px] md:text-xs">
            <span className="text-gray-400 tracking-wide">LEVEL {item.level}</span>
            <span className="text-green-400 tracking-wide">R{item.rarity}</span>
          </div>
        </CardContent>
      </Card>
    </DialogTrigger>

    <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-[95vw] md:max-w-md p-2 md:p-6">
      <DialogHeader>
        <DialogTitle className="text-xs md:text-xl font-bold tracking-wider">{item.name}</DialogTitle>
      </DialogHeader>
      <div className="space-y-2 md:space-y-4">
        <div className="aspect-square relative overflow-hidden rounded-lg">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover"
            style={{ filter: getImageFilter(item.theme.color) }}
          />
        </div>
        <div className="space-y-1 md:space-y-2">
          <div className="flex justify-between text-[8px] md:text-base">
            <span className="text-gray-400">Level</span>
            <span className="text-white">{item.level}</span>
          </div>
          <div className="flex justify-between text-[8px] md:text-base">
            <span className="text-gray-400">Rarity</span>
            <span className="text-green-400">R{item.rarity}</span>
          </div>
          <div className="flex justify-between text-[8px] md:text-base">
            <span className="text-gray-400">Value</span>
            <span className="text-white">{item.value} SUI</span>
          </div>
          <div className="flex justify-between text-[8px] md:text-base">
            <span className="text-gray-400">Owner</span>
            <span className="text-white">{item.owner}</span>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
)

// Main component
export default function Collection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("id")
  const [filterRarity, setFilterRarity] = useState("all")

  // Mock collection data
  const collection: SudozItem[] = Array.from({ length: 24 }, (_, i) => {
    const theme = getRandomTheme()
    return {
      id: i + 1,
      name: `SUDOZ #${1000 + i}`,
      level: Math.floor(Math.random() * 10) + 1,
      rarity: Math.floor(Math.random() * 10) + 1,
      value: Math.floor(Math.random() * 50) + 5,
      image: getRandomImage(),
      theme,
      attributes: [theme.name, theme.rarity, "EVOLVED"],
      owner: "0x1234...5678",
    }
  })

  const filteredCollection = collection
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterRarity === "all" || item.rarity.toString() === filterRarity),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "level":
          return b.level - a.level
        case "rarity":
          return b.rarity - a.rarity
        case "value":
          return b.value - a.value
        default:
          return a.id - b.id
      }
    })

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-40 md:w-96 h-40 md:h-96 bg-green-400/10 rounded-full blur-3xl moving-blur-1"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 md:w-80 h-32 md:h-80 bg-cyan-400/8 rounded-full blur-3xl moving-blur-2"></div>
        <div className="absolute top-1/2 left-1/2 w-24 md:w-64 h-24 md:h-64 bg-green-300/6 rounded-full blur-3xl moving-blur-3"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-2 md:p-6">
        <div className="flex items-center space-x-1.5 md:space-x-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white tracking-wide h-6 md:h-9 px-1 md:px-3">
              <ArrowLeft className="w-2 h-2 md:w-4 md:h-4 mr-0.5 md:mr-2" />
              <span className="text-[8px] md:text-sm">BACK</span>
            </Button>
          </Link>
          <div className="text-xs md:text-2xl font-bold text-green-400 tracking-wider">SUDOZ COLLECTION</div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-2 md:px-6 py-3 md:py-8">
        {/* Filters and Search */}
        <div className="flex flex-row gap-1.5 md:gap-4 mb-3 md:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-1.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-2 h-2 md:w-4 md:h-4" />
            <Input
              placeholder="SEARCH ARTIFACTS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-5 md:pl-10 h-6 md:h-10 text-[8px] md:text-base bg-gray-900/80 border-gray-700 text-white placeholder-gray-400 tracking-wide"
            />
          </div>

          <div className="flex gap-1.5 md:gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-20 md:w-48 h-6 md:h-10 text-[8px] md:text-base bg-gray-900/80 border-gray-700 text-white tracking-wide">
                <SelectValue placeholder="SORT BY" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="level">LEVEL</SelectItem>
                <SelectItem value="rarity">RARITY</SelectItem>
                <SelectItem value="value">VALUE</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterRarity} onValueChange={setFilterRarity}>
              <SelectTrigger className="w-20 md:w-48 h-6 md:h-10 text-[8px] md:text-base bg-gray-900/80 border-gray-700 text-white tracking-wide">
                <Filter className="w-2 h-2 md:w-4 md:h-4 mr-0.5 md:mr-2" />
                <SelectValue placeholder="FILTER BY RARITY" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ALL RARITIES</SelectItem>
                {Array.from({ length: 10 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    RARITY {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <CollectionStats />

        {/* Collection Grid */}
        <div className="grid grid-cols-4 md:grid-cols-6 gap-1.5 md:gap-6">
          {filteredCollection.map((item) => (
            <SudozCard key={item.id} item={item} />
          ))}
        </div>

        {filteredCollection.length === 0 && (
          <div className="text-center py-4 md:py-12">
            <div className="text-gray-400 text-[8px] md:text-lg tracking-wide">NO ARTIFACTS FOUND MATCHING YOUR CRITERIA.</div>
          </div>
        )}

        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 md:mb-20">
            <h2 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-8 tracking-wider">THE SPECIMEN COLLECTION</h2>
            <p className="text-sm md:text-xl text-gray-300 max-w-xs md:max-w-4xl mx-auto leading-relaxed">
              5,555 unique digital life forms await evolution. Each specimen contains distinct genetic markers and
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-16">
            <Card className="bg-gray-900/80 border-gray-700 text-center p-3 md:p-6">
              <div className="text-base md:text-4xl font-bold text-green-400 tracking-wider mb-1 md:mb-2">5,555</div>
              <div className="text-sm md:text-base text-gray-400 tracking-wider">Total Supply</div>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/collection">
              <Button
                size="lg"
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 text-base md:px-10 md:py-4 md:text-lg font-bold rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-105 tracking-wider"
              >
                BROWSE COLLECTION
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
