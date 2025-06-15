# Deployment Guide for Sudoz Evolution Lab

## Build Output

The project has been successfully built and exported. You have two options:

1. **out/** directory - Contains all static files ready for deployment
2. **out.zip** - Compressed version of the out directory

## Deployment Options

### Option 1: Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repository or upload the project
3. Set environment variables:
   ```
   NEXT_PUBLIC_BLOCKVISION_API_KEY=2vmcIQeMF5JdhEXyuyQ8n79UNoO
   NEXT_PUBLIC_SUI_NETWORK=mainnet
   NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.mainnet.sui.io:443
   ```
4. Deploy

### Option 2: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `out` folder to deploy
3. Set environment variables in Site Settings > Environment Variables
4. Add a `_redirects` file with:
   ```
   /*    /index.html   200
   ```

### Option 3: GitHub Pages

1. Create a new repository
2. Upload contents of `out` directory
3. Enable GitHub Pages in repository settings
4. Note: You may need to add a `.nojekyll` file to the root

### Option 4: Traditional Web Hosting

1. Upload contents of `out` directory via FTP/SFTP
2. Ensure your server supports:
   - Fallback routing to index.html for SPA
   - HTTPS (required for wallet connections)

## Important Notes

### API Keys
- The BlockVision API key is optional
- If not provided or if API fails, the app will fallback to direct Sui RPC calls
- This ensures the app works even without the API key

### 403 Error Prevention
- The app now handles API failures gracefully
- Implements timeout and fallback mechanisms
- Caches responses to reduce API calls

### Refresh Issues Fixed
- Trailing slashes added to URLs
- Proper static export configuration
- All pages pre-rendered at build time

### Environment Variables
Create a `.env.local` file for local development:
```env
NEXT_PUBLIC_BLOCKVISION_API_KEY=your_api_key_here
NEXT_PUBLIC_SUI_NETWORK=mainnet
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.mainnet.sui.io:443
```

### Post-Deployment Checklist
- [ ] Test wallet connection
- [ ] Verify NFT loading (both artifacts and evolved)
- [ ] Test evolution functionality
- [ ] Check all pages load correctly
- [ ] Verify no 403 errors in console
- [ ] Test on different devices/browsers

## Troubleshooting

### If you get 403 errors:
1. Check if BlockVision API key is valid
2. The app will automatically fallback to direct Sui queries
3. Check browser console for specific error messages

### If pages don't load on refresh:
1. Ensure your hosting supports SPA routing
2. Add proper redirect rules (see deployment options above)
3. Check that trailing slashes are enabled

### If NFTs don't load:
1. Check wallet is connected to mainnet
2. Verify Sui RPC endpoint is accessible
3. Check browser console for errors

## Support

For issues specific to the Sudoz Evolution Lab, check:
- Contract deployment on Sui mainnet
- Wallet compatibility (Sui Wallet, Suiet, etc.)
- Browser console for detailed error messages