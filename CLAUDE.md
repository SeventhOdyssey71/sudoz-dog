# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` or `pnpm dev` (opens at http://localhost:3000)
- **Build for production**: `npm run build` or `pnpm build`
- **Start production server**: `npm run start` or `pnpm start`
- **Lint code**: `npm run lint` or `pnpm lint`

## Architecture Overview

This is a **Sudoz Evolution Lab** - an NFT evolution platform built with Next.js 15 and TypeScript, featuring Sui blockchain integration for digital collectibles with a genetic evolution system.

### Core Technologies
- **Framework**: Next.js 15 with App Router
- **Blockchain**: Sui network integration via @mysten/dapp-kit and @mysten/sui.js
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: @tanstack/react-query for server state, React Context for local state
- **Wallet**: Sui wallet integration with terms acceptance flow

### Key Architecture Patterns

**Provider Hierarchy** (app/providers.tsx):
```
QueryClientProvider > SuiClientProvider > WalletProvider > TermsProvider > ThemeProvider
```

**Network Configuration**: Defaults to testnet, supports mainnet/localnet switching

**Wallet Authentication Flow**: 
1. Terms acceptance required before wallet connection
2. TermsContext manages global terms state
3. WalletConnect component handles connection UI

**UI Structure**:
- **app/**: Next.js App Router pages
- **components/ui/**: shadcn/ui reusable components
- **app/components/**: App-specific components (WalletConnect, TermsDialog, TermsContext)

### Key Features
- **Vault System**: placeholder pages for giveaways, raffles, and burn mechanisms (app/vault/)
- **Collection Management**: NFT collection display and filtering
- **Evolution Lab**: NFT transformation interface
- **Terms Acceptance**: Required before wallet connection

### Styling Notes
- Uses Orbitron font for sci-fi aesthetic
- Dark theme default with neon color scheme (green/purple/red)
- Custom CSS animations for glow effects
- Responsive design with mobile-first approach

### Configuration
- **ESLint/TypeScript**: Build errors ignored (next.config.mjs)
- **Images**: Unoptimized for deployment flexibility
- **Blockchain**: Sui network integration with transaction signing utilities (contracts/sui.ts)

## Key Components and Hooks

**Form Handling Stack**:
- react-hook-form with zod validation
- @hookform/resolvers for schema integration
- Multiple pre-built form components in components/ui/

**Data Fetching**:
- @tanstack/react-query configured with 1-minute stale time
- Query client available via providers.tsx

**UI Component Library**:
- 40+ shadcn/ui components in components/ui/
- Based on Radix UI primitives
- Customizable via CSS variables and Tailwind

**NFT Display**:
- NFTCard component for individual NFTs
- Evolution levels 1-10 with corresponding images in public/images/

## Development Notes

- Package managers: Supports npm, yarn, and pnpm (has both package-lock.json and pnpm-lock.yaml)
- The project includes extensive UI components - check components/ui/ before creating new ones
- Theme system uses CSS variables defined in globals.css
- Wallet connection requires terms acceptance first (see TermsContext)
- Network defaults to testnet but supports mainnet/localnet switching