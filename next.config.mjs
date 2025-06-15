/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['ipfs.io', 'plum-defeated-leopon-866.mypinata.cloud'],
  },
  trailingSlash: true,
  // Disable runtime JS for better static export
  experimental: {
    optimizeCss: false,
  },
  // Handle environment variables
  env: {
    NEXT_PUBLIC_BLOCKVISION_API_KEY: process.env.NEXT_PUBLIC_BLOCKVISION_API_KEY || '',
    NEXT_PUBLIC_SUI_NETWORK: process.env.NEXT_PUBLIC_SUI_NETWORK || 'mainnet',
    NEXT_PUBLIC_SUI_RPC_URL: process.env.NEXT_PUBLIC_SUI_RPC_URL || 'https://fullnode.mainnet.sui.io:443',
  },
}

export default nextConfig
