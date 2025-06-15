// Type declarations for external modules
declare module '@mysten/dapp-kit' {
  export const useCurrentAccount: () => any;
  export const useSuiClient: () => any;
  export const ConnectButton: any;
  export const WalletProvider: any;
}

declare module '@mysten/sui.js/client' {
  export class SuiClient {
    constructor(options: { url: string });
    getOwnedObjects(params: any): Promise<any>;
  }
}

declare module 'lucide-react' {
  export const CheckCircle: any;
  export const Eye: any;
  export const Dna: any;
  export const ArrowRight: any;
  export const Loader2: any;
  export const Sparkles: any;
  export const AlertTriangle: any;
  export const ArrowLeft: any;
  export const Beaker: any;
  export const Flame: any;
  export const FlaskConical: any;
  export const Scan: any;
  export const Activity: any;
  export const ArrowUpCircle: any;
  export const Wallet: any;
  export const Zap: any;
}

// Extend JSX namespace
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
