# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` or `pnpm dev` or `yarn dev` (opens at http://localhost:3000)
- **Build for production**: `npm run build` or `pnpm build` or `yarn build`
- **Start production server**: `npm run start` or `pnpm start` or `yarn start`
- **Lint code**: `npm run lint` or `pnpm lint` or `yarn lint`
- **Build and export for deployment**: `./build-and-export.sh` (creates static export in `out/` directory)

## Architecture Overview

This is a **Sudoz Evolution Lab** - an NFT evolution platform built with Next.js 15 and TypeScript, featuring Sui blockchain integration for digital collectibles with a genetic evolution system.

### Core Technologies
- **Framework**: Next.js 15 with App Router (static export enabled)
- **Blockchain**: Sui network integration via @mysten/dapp-kit and @mysten/sui.js
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: @tanstack/react-query for server state, React Context for local state
- **Wallet**: Sui wallet integration with terms acceptance flow
- **API Integration**: BlockVision API for NFT metadata with RPC fallback

### Key Architecture Patterns

**Provider Hierarchy** (app/providers.tsx):
```
QueryClientProvider > SuiClientProvider > WalletProvider > TermsProvider > ThemeProvider
```

**Network Configuration**: Defaults to mainnet, supports testnet/localnet switching via NEXT_PUBLIC_SUI_NETWORK

**Wallet Authentication Flow**: 
1. Terms acceptance required before wallet connection
2. TermsContext manages global terms state
3. WalletConnect component handles connection UI

**UI Structure**:
- **app/**: Next.js App Router pages
- **components/ui/**: shadcn/ui reusable components (40+ components)
- **app/components/**: App-specific components (WalletConnect, TermsDialog, TermsContext)

### Key Features
- **Evolution System**: 10-level artifact upgrade system, Level 10 artifacts can evolve into rare "Evolved SUDOZ"
- **NFT Collection**: Real-time NFT display with search/filter, supports owned NFTs and kiosk NFTs
- **Vault System**: Placeholder pages for giveaways, raffles, and burn mechanisms (app/vault/)
- **Terms Acceptance**: Required before wallet connection

### Contract Configuration
- **Package ID**: `0xcc8db15b6f3b91187f0b12a3e96e7b18bb7b890c16f71df59ad0b931a2bb969d`
- **NFT Supply**: 2000 total (100 OGs + 1900 Artifacts)
- **Evolution Paths**: 7 unique paths (Rainbow, Zebra, Mars, Nature, Sky, Shadow, Vintage)
- **Revenue Split**: 25% charity wallet, 75% evolution wallet
- **Evolution Cost**: 1 SUI per level upgrade

### Environment Variables
```bash
NEXT_PUBLIC_BLOCKVISION_API_KEY    # BlockVision API key for NFT metadata
NEXT_PUBLIC_SUI_NETWORK            # Network selection (mainnet/testnet/localnet)
```

### Styling Notes
- Uses Orbitron font for sci-fi aesthetic
- Dark theme default with neon color scheme (green #00ff88, purple #a259ff, red/yellow accents)
- Custom CSS animations for glow effects and moving background blurs
- Responsive design with mobile-first approach

### Configuration
- **Build**: Static export with `output: 'export'`, ESLint/TypeScript errors ignored
- **Images**: Unoptimized for deployment flexibility
- **Blockchain**: Sui network integration with transaction signing utilities (contracts/sui.ts)

## Key Components and Hooks

**Custom Hooks**:
- `useNFTs()`: Fetches NFTs with caching, supports BlockVision API with RPC fallback, handles owned and kiosk NFTs

**Form Handling Stack**:
- react-hook-form with zod validation
- @hookform/resolvers for schema integration
- Multiple pre-built form components in components/ui/

**Data Fetching**:
- @tanstack/react-query configured with 1-minute stale time
- Automatic retry logic and request deduplication
- Query client available via providers.tsx

**UI Component Library**:
- 40+ shadcn/ui components in components/ui/
- Based on Radix UI primitives
- Customizable via CSS variables and Tailwind

**NFT Display**:
- NFTCard component for individual NFTs
- Evolution levels 1-10 with corresponding images in public/images/
- EvolvedNFTDisplay for rare evolved NFTs

## Deployment

**Static Export**:
```bash
./build-and-export.sh  # Creates optimized static build in out/ directory
```

**Hosting Options**:
- Vercel: Push to GitHub, connect repo
- Netlify: Deploy from out/ directory
- GitHub Pages: Use github-pages branch
- IPFS: Upload out/ directory

**Post-Deployment Testing**:
1. Verify wallet connection works
2. Check NFT loading and display
3. Test evolution functionality
4. Confirm terms dialog appears
5. Validate responsive design

## Development Notes

- Package managers: Supports npm, yarn, and pnpm (has both package-lock.json and pnpm-lock.yaml)
- The project includes extensive UI components - check components/ui/ before creating new ones
- Theme system uses CSS variables defined in globals.css
- Wallet connection requires terms acceptance first (see TermsContext)
- BlockVision API is used for NFT metadata, falls back to direct RPC if unavailable
- Evolution images are stored in public/images/level-{1-10}/ and public/images/evolved/