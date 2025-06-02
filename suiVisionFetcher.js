// BlockVision API NFT Fetcher
// A more reliable approach to fetch SUDOZ NFTs from kiosks using BlockVision API

import { SuiClient } from '@mysten/sui.js/client';
// Note: Transaction class is only used in example strings, not actually instantiated
// so we don't need to import it
import fetch from 'node-fetch';

// Initialize Sui client for fallback and transaction examples
const suiClient = new SuiClient({ 
  url: 'https://fullnode.mainnet.sui.io:443',
  timeoutMs: 60000 // 60 second timeout
});

// Target wallet and NFT type
const walletAddress = '0x98a945d6523ba0b4685c4d50d0449c811fded93ad7a20cf2d61af6a6fd4d4d0b';
const targetNFTType = '0xd44eeba23c7256b426113b5b645638f00abc0f27ec224f7286be6f9853df8a5a::_sudoz_artifacts::Nft';

// BlockVision API Key
const BLOCKVISION_API_KEY = '2vmcIQeMF5JdhEXyuyQ8n79UNoO';

// BlockVision API for fetching kiosk NFTs
async function fetchNFTsWithBlockVision(walletAddress, apiKey) {
  try {
    console.log(`Fetching NFTs for wallet ${walletAddress} using BlockVision API...`);
    
    // Construct URL with parameters
    const url = new URL('https://api.blockvision.org/v2/sui/account/nfts');
    url.searchParams.append('account', walletAddress);
    url.searchParams.append('type', 'kiosk'); // Specifically request kiosk NFTs
    url.searchParams.append('pageIndex', '1');
    url.searchParams.append('pageSize', '50');
    
    const headers = {
      'accept': 'application/json',
      'x-api-key': apiKey
    };
    
    const response = await fetch(url.toString(), { headers });
    
    if (!response.ok) {
      throw new Error(`BlockVision API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (result.code !== 200) {
      throw new Error(`BlockVision API error: ${result.message}`);
    }
    
    const nfts = result.result.data || [];
    console.log(`Found ${nfts.length} NFTs in kiosks`);
    
    // Filter for SUDOZ NFTs
    const sudozNfts = nfts.filter(nft => 
      nft.collection && (
        nft.collection === targetNFTType ||
        nft.collection.toLowerCase().includes('sudoz') ||
        nft.collection.toLowerCase().includes('_sudoz_')
      )
    );
    
    console.log(`Found ${sudozNfts.length} SUDOZ NFTs`);
    
    // Add transaction examples
    return sudozNfts.map(nft => ({
      ...nft,
      transactionExample: `
const tx = new Transaction();
const borrowedNft = tx.moveCall({
  target: '0x2::kiosk::borrow',
  arguments: [tx.object("${nft.kioskId}"), tx.pure.id("${nft.objectId}")],
  typeArguments: ["${nft.collection}"],
});
tx.moveCall({
  target: '0x2::kiosk::return_val',
  arguments: [tx.object("${nft.kioskId}"), tx.pure.id("${nft.objectId}"), borrowedNft],
  typeArguments: ["${nft.collection}"],
});`
    }));
  } catch (error) {
    console.error(`Error fetching NFTs with BlockVision: ${error.message}`);
    return [];
  }
}

// Fallback to SuiVision Explorer API
// This is a public API endpoint that doesn't require an API key
async function fetchNFTsWithSuiVision(walletAddress) {
  try {
    console.log(`Fetching NFTs for wallet ${walletAddress} using SuiVision API...`);
    
    // First get all objects owned by the wallet
    const url = `https://api.suivision.xyz/api/wallet/objects?address=${walletAddress}&limit=50`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`SuiVision API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(`SuiVision API returned error: ${data.message || 'Unknown error'}`);
    }
    
    console.log(`Found ${data.data.objects.length} objects owned by wallet`);
    
    // Look for kiosk caps
    const kioskCaps = data.data.objects.filter(obj => 
      obj.type && (
        obj.type.includes('kiosk') || 
        obj.type.includes('Kiosk')
      ) && obj.type.includes('Cap')
    );
    
    console.log(`Found ${kioskCaps.length} potential kiosk caps`);
    
    // Get kiosk IDs
    const kioskIds = [];
    for (const cap of kioskCaps) {
      // Get object details
      const objUrl = `https://api.suivision.xyz/api/object/${cap.objectId}`;
      const objResponse = await fetch(objUrl);
      
      if (!objResponse.ok) {
        console.log(`Error fetching object ${cap.objectId}: ${objResponse.status}`);
        continue;
      }
      
      const objData = await objResponse.json();
      
      if (!objData.success) {
        console.log(`Error in object data for ${cap.objectId}: ${objData.message || 'Unknown error'}`);
        continue;
      }
      
      // Look for kiosk ID in fields
      if (objData.data.content?.fields) {
        // Check for standard kiosk owner cap
        if (objData.data.content.fields.for && typeof objData.data.content.fields.for === 'string') {
          kioskIds.push(objData.data.content.fields.for);
        }
        
        // Check for nested kiosk owner cap
        if (objData.data.content.fields.cap?.fields?.for && 
            typeof objData.data.content.fields.cap.fields.for === 'string') {
          kioskIds.push(objData.data.content.fields.cap.fields.for);
        }
      }
    }
    
    console.log(`Found ${kioskIds.length} kiosk IDs: ${kioskIds.join(', ')}`);
    
    // Get NFTs from each kiosk
    const allNfts = [];
    
    for (const kioskId of kioskIds) {
      // Get kiosk details
      const kioskUrl = `https://api.suivision.xyz/api/object/${kioskId}`;
      const kioskResponse = await fetch(kioskUrl);
      
      if (!kioskResponse.ok) {
        console.log(`Error fetching kiosk ${kioskId}: ${kioskResponse.status}`);
        continue;
      }
      
      const kioskData = await kioskResponse.json();
      
      if (!kioskData.success) {
        console.log(`Error in kiosk data for ${kioskId}: ${kioskData.message || 'Unknown error'}`);
        continue;
      }
      
      // Get dynamic fields
      const dynamicFieldsUrl = `https://api.suivision.xyz/api/object/${kioskId}/dynamic-fields`;
      const dynamicFieldsResponse = await fetch(dynamicFieldsUrl);
      
      if (!dynamicFieldsResponse.ok) {
        console.log(`Error fetching dynamic fields for kiosk ${kioskId}: ${dynamicFieldsResponse.status}`);
        continue;
      }
      
      const dynamicFieldsData = await dynamicFieldsResponse.json();
      
      if (!dynamicFieldsData.success) {
        console.log(`Error in dynamic fields data for ${kioskId}: ${dynamicFieldsData.message || 'Unknown error'}`);
        continue;
      }
      
      // Find items in the kiosk
      const items = dynamicFieldsData.data.filter(field => 
        field.name?.type === '0x2::kiosk::Item' || 
        (field.name?.type && field.name.type.includes('Item'))
      );
      
      console.log(`Found ${items.length} items in kiosk ${kioskId}`);
      
      // Check each item
      for (const item of items) {
        const nftId = item.name?.value?.id;
        if (!nftId) {
          continue;
        }
        
        // Get the NFT details
        const nftUrl = `https://api.suivision.xyz/api/object/${nftId}`;
        const nftResponse = await fetch(nftUrl);
        
        if (!nftResponse.ok) {
          console.log(`Error fetching NFT ${nftId}: ${nftResponse.status}`);
          continue;
        }
        
        const nftData = await nftResponse.json();
        
        if (!nftData.success) {
          console.log(`Error in NFT data for ${nftId}: ${nftData.message || 'Unknown error'}`);
          continue;
        }
        
        // Check if it's a SUDOZ NFT
        const nftType = nftData.data.type;
        const isSudozNft = nftType === targetNFTType || 
                          (nftType && (
                            nftType.toLowerCase().includes('sudoz') || 
                            nftType.toLowerCase().includes('_sudoz_')
                          ));
        
        if (isSudozNft) {
          console.log(`Found SUDOZ NFT: ${nftId}`);
          
          // Add to found NFTs
          allNfts.push({
            objectId: nftId,
            name: nftData.data.content?.fields?.name || 'Sudoz Artifacts',
            image: nftData.data.display?.data?.image_url || '',
            description: nftData.data.content?.fields?.description || '',
            collection: nftType,
            kioskId: kioskId,
            transactionExample: `
const tx = new Transaction();
const borrowedNft = tx.moveCall({
  target: '0x2::kiosk::borrow',
  arguments: [tx.object("${kioskId}"), tx.pure.id("${nftId}")],
  typeArguments: ["${nftType}"],
});
tx.moveCall({
  target: '0x2::kiosk::return_val',
  arguments: [tx.object("${kioskId}"), tx.pure.id("${nftId}"), borrowedNft],
  typeArguments: ["${nftType}"],
});`
          });
        }
      }
    }
    
    console.log(`Found a total of ${allNfts.length} SUDOZ NFTs`);
    return allNfts;
  } catch (error) {
    console.error(`Error fetching NFTs with SuiVision: ${error.message}`);
    return [];
  }
}

// Fallback to direct blockchain query using our previous method
async function fetchNFTsDirectly(walletAddress, kioskId) {
  try {
    console.log(`Falling back to direct blockchain query for wallet ${walletAddress}...`);
    
    // Get dynamic fields of the kiosk
    const fields = await suiClient.getDynamicFields({
      parentId: kioskId
    });
    
    console.log(`Found ${fields.data.length} fields in kiosk`);
    
    // Find items in the kiosk
    const items = fields.data.filter(f => 
      f.name?.type === '0x2::kiosk::Item' || 
      f.name?.type?.includes('Item')
    );
    
    console.log(`Found ${items.length} items in kiosk`);
    
    const nfts = [];
    
    // Check each item
    for (const item of items) {
      const nftId = item.name?.value?.id;
      if (!nftId) {
        continue;
      }
      
      // Get the NFT details
      const nft = await suiClient.getObject({
        id: nftId,
        options: { showType: true, showContent: true, showDisplay: true }
      });
      
      // Check if it's a SUDOZ NFT
      const nftType = nft.data?.type;
      const isSudozNft = nftType === targetNFTType || 
                        (nftType && (
                          nftType.toLowerCase().includes('sudoz') || 
                          nftType.toLowerCase().includes('_sudoz_')
                        ));
      
      if (isSudozNft) {
        console.log(`Found SUDOZ NFT: ${nftId}`);
        
        // Add to found NFTs
        nfts.push({
          objectId: nftId,
          name: nft.data.content?.fields?.name || 'Sudoz Artifacts',
          image: nft.data.display?.data?.image_url || '',
          description: nft.data.content?.fields?.description || '',
          collection: nftType,
          kioskId: kioskId,
          transactionExample: `
const tx = new Transaction();
const borrowedNft = tx.moveCall({
  target: '0x2::kiosk::borrow',
  arguments: [tx.object("${kioskId}"), tx.pure.id("${nftId}")],
  typeArguments: ["${nftType}"],
});
tx.moveCall({
  target: '0x2::kiosk::return_val',
  arguments: [tx.object("${kioskId}"), tx.pure.id("${nftId}"), borrowedNft],
  typeArguments: ["${nftType}"],
});`
        });
      }
    }
    
    console.log(`Found a total of ${nfts.length} SUDOZ NFTs directly from blockchain`);
    return nfts;
  } catch (error) {
    console.error(`Error fetching NFTs directly: ${error.message}`);
    return [];
  }
}

// Main function to fetch NFTs using all available methods
async function fetchAllSudozNFTs(walletAddress) {
  console.log(`Fetching all SUDOZ NFTs for wallet: ${walletAddress}`);
  
  // Try BlockVision API first with our API key
  let nfts = await fetchNFTsWithBlockVision(walletAddress, BLOCKVISION_API_KEY);
  
  // If no results, try SuiVision
  if (nfts.length === 0) {
    nfts = await fetchNFTsWithSuiVision(walletAddress);
  }
  
  // If still no results, fall back to direct blockchain query
  if (nfts.length === 0) {
    // Known kiosk ID from our previous findings
    const knownKioskId = '0xca37afffef6daf8091b2cffa1942677be7fed70aafcf19ac0cab5e43ca8ff91b';
    nfts = await fetchNFTsDirectly(walletAddress, knownKioskId);
  }
  
  // Print summary
  console.log(`
=== SUMMARY ===`);
  console.log(`Found a total of ${nfts.length} SUDOZ NFTs for wallet ${walletAddress}`);
  
  for (let i = 0; i < nfts.length; i++) {
    const nft = nfts[i];
    console.log(`
${i+1}. NFT ID: ${nft.objectId}`);
    console.log(`   Type: ${nft.collection}`);
    if (nft.name) console.log(`   Name: ${nft.name}`);
    console.log(`   Kiosk: ${nft.kioskId}`);
  }
  
  return nfts;
}

// Run the fetch
fetchAllSudozNFTs(walletAddress);
