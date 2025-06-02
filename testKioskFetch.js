// Test script for fetching NFTs from kiosks
const { SuiClient } = require('@mysten/sui.js/client');

// Target NFT type to filter for
const targetNFTType = "0xd44eeba23c7256b426113b5b645638f00abc0f27ec224f7286be6f9853df8a5a::_sudoz_artifacts::Nft";
const targetPackageId = "0xd44eeba23c7256b426113b5b645638f00abc0f27ec224f7286be6f9853df8a5a";

// Kiosk-related constants
const KIOSK_MODULE = "0x2::kiosk";
const KIOSK_TYPE = `${KIOSK_MODULE}::Kiosk`;
const KIOSK_OWNER_CAP_TYPE = `${KIOSK_MODULE}::KioskOwnerCap`;
const KIOSK_ITEM_TYPE = `${KIOSK_MODULE}::Item`;
const TRANSFER_POLICY_TYPE = "0x2::transfer_policy::TransferPolicy";
const TRANSFER_POLICY_CAP_TYPE = "0x2::transfer_policy::TransferPolicyCap";
const LISTING_TYPE = `${KIOSK_MODULE}::Listing`;

// Real wallet address to test with
const testWalletAddress = '0x9a5b0ad3a18964ab7c0dbf9ab4cdecfd6b3899423b47313ae6e78f4b801022a3';

// Specific kiosk ID to examine
const specificKioskId = '0xca37afffef6daf8091b2cffa1942677be7fed70aafcf19ac0cab5e43ca8ff91b';

// Specific NFT ID from the dynamic field
const specificNftId = '0xd04ae7be773610c1a0588e27e97078dc1cd6d228ca97a08eb8b35ad869fcdb07';

/**
 * Fetches NFT data for a given wallet address and a specific NFT type.
 * @param {string} walletAddress The wallet address to fetch NFTs for.
 * @returns {Promise<Array<Object> | null>} A promise that resolves with an array of NFT objects or null if none found/error.
 */
async function fetchNFTDataForWallet(walletAddress) {
  const suiClient = new SuiClient({ url: 'https://fullnode.mainnet.sui.io:443' });
  try {
    // First check for directly owned NFTs
    const directlyOwnedNFTs = await fetchDirectlyOwnedNFTs(suiClient, walletAddress);
    
    // Then check for NFTs in kiosks using the automatic discovery method
    const kioskNFTs = await fetchNFTsFromKiosks(suiClient, walletAddress);
    
    // Combine all results
    return [...directlyOwnedNFTs, ...kioskNFTs];
  } catch (error) {
    console.error("Error fetching NFT data:", error);
    return [];
  }
}

/**
 * Fetches directly owned NFTs for a wallet
 */
async function fetchDirectlyOwnedNFTs(suiClient, walletAddress) {
  try {
    console.log('Fetching directly owned SUDOZ NFTs for wallet:', walletAddress);
    
    const ownedObjects = await suiClient.getOwnedObjects({
      owner: walletAddress,
      filter: { StructType: targetNFTType },
      options: { showDisplay: true, showContent: true, showType: true },
    });
    
    console.log(`Found ${ownedObjects.data?.length || 0} directly owned NFTs`);
    return ownedObjects.data || [];
  } catch (error) {
    console.error("Error fetching directly owned NFTs:", error);
    return [];
  }
}

/**
 * Fetches NFTs from kiosks owned by a wallet
 */
async function fetchNFTsFromKiosks(suiClient, walletAddress) {
  try {
    console.log('Fetching kiosk NFTs for wallet:', walletAddress);
    
    // Step 1: Find all KioskOwnerCap objects owned by the wallet
    const kioskOwnerCaps = await suiClient.getOwnedObjects({
      owner: walletAddress,
      filter: { StructType: KIOSK_OWNER_CAP_TYPE },
      options: { showContent: true },
    });
    
    console.log(`Found ${kioskOwnerCaps.data?.length || 0} kiosk owner caps`);
    
    if (!kioskOwnerCaps.data || kioskOwnerCaps.data.length === 0) {
      return [];
    }
    
    let allKioskNFTs = [];
    
    // Step 2: For each KioskOwnerCap, get the associated Kiosk
    for (const cap of kioskOwnerCaps.data) {
      try {
        // The 'for' field in the KioskOwnerCap points to the Kiosk ID
        const kioskId = cap.data?.content?.fields?.for;
        if (!kioskId) {
          console.log('No kiosk ID found in KioskOwnerCap');
          continue;
        }
        
        console.log(`Processing kiosk: ${kioskId}`);
        
        // Step 3: Get the kiosk object to verify it exists
        const kioskObj = await suiClient.getObject({
          id: kioskId,
          options: { showContent: true },
        });
        
        if (!kioskObj.data) {
          console.log(`Kiosk ${kioskId} not found`);
          continue;
        }
        
        // Step 4: Get all items in the kiosk using getDynamicFields
        const kioskItems = await suiClient.getDynamicFields({
          parentId: kioskId,
        });
        
        console.log(`Found ${kioskItems.data?.length || 0} dynamic fields in kiosk ${kioskId}`);
        
        // Step 5: Process each dynamic field to find items
        for (const field of kioskItems.data || []) {
          // Only process fields that represent items (not listings or other fields)
          if (field.name?.type === KIOSK_ITEM_TYPE) {
            // The name.value.id contains the object ID of the actual NFT
            const nftId = field.name?.value?.id;
            if (!nftId) {
              console.log('No NFT ID found in kiosk item');
              continue;
            }
            
            console.log(`Found item in kiosk with ID: ${nftId}`);
            
            // Step 6: Get the actual NFT object
            const nftObj = await suiClient.getObject({
              id: nftId,
              options: { showDisplay: true, showContent: true, showType: true },
            });
            
            if (!nftObj.data) {
              console.log(`NFT ${nftId} not found`);
              continue;
            }
            
            // Step 7: Check if this NFT matches our target type
            const nftType = nftObj.data?.type;
            console.log(`NFT type: ${nftType}`);
            
            const isSudozNft = nftType && (
              nftType === targetNFTType ||
              nftType.includes('_sudoz_artifacts::Nft') ||
              nftType.includes('0xd44eeba23c7256b426113b5b645638f00abc0f27ec224f7286be6f9853df8a5a')
            );
            
            if (isSudozNft) {
              console.log(`Found target NFT in kiosk: ${nftId}`);
              
              // Add kiosk information to the NFT object
              nftObj.data.kioskId = kioskId;
              nftObj.data.isInKiosk = true;
              allKioskNFTs.push(nftObj);
            }
          }
        }
      } catch (err) {
        console.error(`Error processing kiosk: ${err.message}`);
      }
    }
    
    console.log(`Total kiosk NFTs found: ${allKioskNFTs.length}`);
    return allKioskNFTs;
  } catch (error) {
    console.error(`Error fetching NFTs from kiosks: ${error.message}`);
    return [];
  }
}

/**
 * Fetches NFT data for a given wallet address and a specific NFT type.
 * @param {string} walletAddress The wallet address to fetch NFTs for.
 * @returns {Promise<Array<Object> | null>} A promise that resolves with an array of NFT objects or null if none found/error.
 */
async function fetchNFTDataForWallet(walletAddress) {
  const suiClient = new SuiClient({ url: 'https://fullnode.mainnet.sui.io:443' });
  try {
    console.log('Starting NFT fetch for wallet:', walletAddress);
    
    // First check for directly owned NFTs
    const directlyOwnedNFTs = await fetchDirectlyOwnedNFTs(suiClient, walletAddress);
    
    // Then check for NFTs in kiosks using the automatic discovery method
    const kioskNFTs = await fetchNFTsFromKiosks(suiClient, walletAddress);
    
    // Combine all results
    const allNFTs = [...directlyOwnedNFTs, ...kioskNFTs];
    console.log(`Total NFTs found: ${allNFTs.length} (${directlyOwnedNFTs.length} direct + ${kioskNFTs.length} in kiosks)`);
    
    return allNFTs;
  } catch (error) {
    console.error("Error fetching NFT data:", error);
    return [];
  }
}

/**
 * Fetches directly owned NFTs for a wallet
 * @param {SuiClient} suiClient - The Sui client instance
 * @param {string} walletAddress - The wallet address to fetch NFTs for
 * @returns {Promise<Array<Object>>} - Array of NFT objects
 */
async function fetchDirectlyOwnedNFTs(suiClient, walletAddress) {
  try {
    console.log('Fetching directly owned NFTs for wallet:', walletAddress);
    
    // First try with exact type match
    const ownedObjects = await suiClient.getOwnedObjects({
      owner: walletAddress,
      filter: { StructType: targetNFTType },
      options: { showDisplay: true, showContent: true, showType: true },
    });
    
    console.log(`Found ${ownedObjects.data?.length || 0} directly owned NFTs with exact type match`);
    
    // If we didn't find any with the exact type, try a broader search with package ID
    if (!ownedObjects.data || ownedObjects.data.length === 0) {
      console.log('No exact matches found, trying broader search with package ID...');
      
      // Try to find objects that match the target package ID
      try {
        // Use a more targeted approach to avoid timeouts
        const packageObjects = await suiClient.getOwnedObjects({
          owner: walletAddress,
          filter: { Package: targetPackageId },  // Filter by the package ID
          options: { showDisplay: true, showContent: true, showType: true },
          limit: 50  // Limit to avoid timeouts
        });
        
        console.log(`Found ${packageObjects.data?.length || 0} objects from target package`);
        
        // Filter for potential SUDOZ NFTs
        const filteredNFTs = [];
        
        for (const obj of packageObjects.data || []) {
          const objType = obj.data?.type;
          if (objType) {
            // Check if it matches our target NFT type using flexible matching
            const isSudozNft = 
              objType === targetNFTType || 
              objType.includes('_sudoz_artifacts::Nft') || 
              objType.includes(targetPackageId);
            
            if (isSudozNft) {
              console.log(`Found SUDOZ NFT with type: ${objType}`);
              filteredNFTs.push(obj);
            }
          }
        }
        
        console.log(`Found ${filteredNFTs.length} NFTs after broader search`);
        return filteredNFTs;
      } catch (searchError) {
        console.error("Error in broader search:", searchError);
        // If broader search fails, just return the original results
        return ownedObjects.data || [];
      }
    }
      
    return ownedObjects.data || [];
  } catch (error) {
    console.error("Error fetching directly owned NFTs:", error);
    return [];
  }
}

/**
 * Fetches NFTs from kiosks owned by a wallet using the official Sui kiosk structure
 * @param {SuiClient} suiClient - The Sui client instance
 * @param {string} walletAddress - The wallet address to fetch kiosk NFTs for
 * @returns {Promise<Array<Object>>} - Array of NFT objects with kiosk metadata
 */
async function fetchNFTsFromKiosks(suiClient, walletAddress) {
  try {
    console.log('Fetching kiosk NFTs for wallet:', walletAddress);
    
    // Step 1: Find all KioskOwnerCap objects owned by the wallet
    // According to Sui docs, kiosks are owned via KioskOwnerCap objects
    const kioskOwnerCaps = await suiClient.getOwnedObjects({
      owner: walletAddress,
      filter: { StructType: KIOSK_OWNER_CAP_TYPE },
      options: { showContent: true },
    });
    
    console.log(`Found ${kioskOwnerCaps.data?.length || 0} kiosk owner caps`);
    
    if (!kioskOwnerCaps.data || kioskOwnerCaps.data.length === 0) {
      console.log('No kiosk owner caps found, wallet does not own any kiosks');
      return [];
    }
    
    // Extract kiosk IDs from the owner caps
    const kioskIds = [];
    for (const cap of kioskOwnerCaps.data) {
      // The 'for' field in the KioskOwnerCap points to the Kiosk ID
      const kioskId = cap.data?.content?.fields?.for;
      if (kioskId) {
        console.log(`Found kiosk ID: ${kioskId} from owner cap`);
        kioskIds.push(kioskId);
      }
    }
    
    console.log(`Total kiosks to process: ${kioskIds.length}`);
    
    if (kioskIds.length === 0) {
      console.log('No valid kiosk IDs found in owner caps');
      return [];
    }
    
    // Process each kiosk to find NFTs
    let allKioskNFTs = [];
    
    for (const kioskId of kioskIds) {
      try {
        console.log(`Processing kiosk: ${kioskId}`);
        
        // Verify the kiosk exists
        const kioskObj = await suiClient.getObject({
          id: kioskId,
          options: { showContent: true, showType: true },
        });
        
        if (!kioskObj.data) {
          console.log(`Kiosk ${kioskId} not found or inaccessible`);
          continue;
        }
        
        // Confirm this is actually a kiosk
        const isKiosk = kioskObj.data?.type?.includes('kiosk::Kiosk');
        if (!isKiosk) {
          console.log(`Object ${kioskId} is not a kiosk, it's a ${kioskObj.data?.type}`);
          continue;
        }
        
        // Get all dynamic fields in the kiosk
        // According to Sui docs, items in kiosks are stored as dynamic fields
        const kioskItems = await suiClient.getDynamicFields({
          parentId: kioskId,
        });
        
        console.log(`Found ${kioskItems.data?.length || 0} dynamic fields in kiosk ${kioskId}`);
        
        // Track different types of fields for debugging
        const itemFields = [];
        const listingFields = [];
        const otherFields = [];
        
        // Process each dynamic field to find items
        for (const field of kioskItems.data || []) {
          try {
            // Categorize the field type
            if (field.name?.type === KIOSK_ITEM_TYPE) {
              itemFields.push(field);
            } else if (field.name?.type === LISTING_TYPE) {
              listingFields.push(field);
            } else {
              otherFields.push(field);
            }
            
            // Only process fields that represent items (not listings or other fields)
            // According to Sui docs, NFTs are stored with type 0x2::kiosk::Item
            if (field.name?.type === KIOSK_ITEM_TYPE) {
              // The name.value.id contains the object ID of the actual NFT
              const nftId = field.name?.value?.id;
              if (!nftId) {
                console.log('No NFT ID found in kiosk item field');
                continue;
              }
              
              console.log(`Found item in kiosk with ID: ${nftId}`);
              
              // Get the actual NFT object with all details
              const nftObj = await suiClient.getObject({
                id: nftId,
                options: { showDisplay: true, showContent: true, showType: true },
              });
              
              if (!nftObj.data) {
                console.log(`NFT ${nftId} not found or inaccessible`);
                continue;
              }
              
              // Check if this NFT matches our target type
              const nftType = nftObj.data?.type;
              console.log(`NFT type: ${nftType}`);
              
              // Use flexible matching to catch all variations of SUDOZ NFTs
              const isSudozNft = nftType && (
                nftType === targetNFTType ||
                nftType.includes('_sudoz_artifacts::Nft') ||
                nftType.includes(targetPackageId)
              );
              
              if (isSudozNft) {
                console.log(`Found SUDOZ NFT in kiosk: ${nftId}`);
                
                // Check if this item is listed for sale
                const isListed = listingFields.some(listing => {
                  // In a listing, the item_id field contains the NFT ID
                  return listing.objectId && 
                         listing.name?.type === LISTING_TYPE && 
                         listing.name?.value?.id === nftId;
                });
                
                // Add kiosk information to the NFT object for UI display
                nftObj.data.kioskId = kioskId;
                nftObj.data.isInKiosk = true;
                nftObj.data.isListed = isListed;
                
                // Add display name if not present
                if (!nftObj.data.display?.name && nftObj.data.content?.fields?.name) {
                  if (!nftObj.data.display) nftObj.data.display = {};
                  nftObj.data.display.name = nftObj.data.content.fields.name;
                }
                
                // Add to results
                allKioskNFTs.push(nftObj);
              } else {
                console.log(`NFT in kiosk does not match target type: ${nftType}`);
              }
            }
          } catch (fieldError) {
            console.error(`Error processing kiosk field: ${fieldError.message}`);
            // Continue with next field
          }
        }
        
        // Log summary of field types for debugging
        console.log(`Kiosk ${kioskId} contains:`);
        console.log(`- ${itemFields.length} item fields`);
        console.log(`- ${listingFields.length} listing fields`);
        console.log(`- ${otherFields.length} other fields`);
      } catch (kioskError) {
        console.error(`Error processing kiosk ${kioskId}: ${kioskError.message}`);
        // Continue with next kiosk
      }
    }
    
    console.log(`Total SUDOZ NFTs found in kiosks: ${allKioskNFTs.length}`);
    return allKioskNFTs;
  } catch (error) {
    console.error(`Error fetching NFTs from kiosks: ${error.message}`);
    return [];
  }
}

async function testFetchNFTs() {
  console.log('=== STARTING KIOSK NFT FETCH TEST ===');
  console.log(`Testing wallet: ${testWalletAddress}`);
  
  try {
    console.log('Fetching NFTs...');
    const nfts = await fetchNFTDataForWallet(testWalletAddress);
    
    console.log(`\n=== RESULTS ===`);
    console.log(`Total NFTs found: ${nfts.length}`);
    
    if (nfts.length > 0) {
      console.log('\nNFT Details:');
      nfts.forEach((nft, index) => {
        console.log(`\n--- NFT #${index + 1} ---`);
        console.log(`Object ID: ${nft.data?.objectId || 'Unknown'}`);
        console.log(`Type: ${nft.data?.type || 'Unknown'}`);
        console.log(`Name: ${nft.data?.display?.name || 'Unnamed'}`);
        console.log(`In Kiosk: ${nft.data?.isInKiosk ? 'Yes' : 'No'}`);
        if (nft.data?.isInKiosk) {
          console.log(`Kiosk ID: ${nft.data?.kioskId || 'Unknown'}`);
        }
      });
    } else {
      console.log('No NFTs found for this wallet.');
    }
    
    console.log('\n=== TEST COMPLETED ===');
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

/**
 * Examines a specific kiosk ID and its dynamic fields
 */
async function examineSpecificKiosk() {
  console.log('=== EXAMINING SPECIFIC KIOSK ===');
  console.log(`Kiosk ID: ${specificKioskId}`);
  
  const suiClient = new SuiClient({ url: 'https://fullnode.mainnet.sui.io:443' });
  
  try {
    // First, get the kiosk details
    console.log('Fetching kiosk details...');
    const kioskDetails = await suiClient.getObject({
      id: specificKioskId,
      options: { showContent: true, showType: true, showOwner: true }
    });
    
    console.log('\nKiosk Type:', kioskDetails.data?.type);
    console.log('Kiosk Owner:', kioskDetails.data?.owner);
    console.log('\nKiosk Content:', JSON.stringify(kioskDetails.data?.content, null, 2));
    
    // Verify this is a kiosk
    const isKiosk = kioskDetails.data?.type?.includes('kiosk::Kiosk');
    if (!isKiosk) {
      console.log('\nWARNING: This object is not a kiosk!');
      return;
    } else {
      console.log('\nConfirmed: This is a Kiosk object');
    }
    
    // Extract owner from kiosk content
    const kioskOwner = kioskDetails.data?.content?.fields?.owner;
    console.log(`Kiosk Owner Address: ${kioskOwner}`);
    
    // Get all dynamic fields in the kiosk
    console.log('\nFetching dynamic fields from kiosk...');
    const kioskItems = await suiClient.getDynamicFields({
      parentId: specificKioskId,
    });
    
    console.log(`Found ${kioskItems.data?.length || 0} dynamic fields in kiosk`);
    
    // Track different types of fields for debugging
    const itemFields = [];
    const listingFields = [];
    const otherFields = [];
    
    // Process each dynamic field to categorize them
    if (kioskItems.data && kioskItems.data.length > 0) {
      console.log('\nCategorizing dynamic fields:');
      for (const field of kioskItems.data) {
        if (field.name?.type === KIOSK_ITEM_TYPE) {
          itemFields.push(field);
        } else if (field.name?.type === LISTING_TYPE) {
          listingFields.push(field);
        } else {
          otherFields.push(field);
        }
      }
      
      console.log(`- ${itemFields.length} item fields`);
      console.log(`- ${listingFields.length} listing fields`);
      console.log(`- ${otherFields.length} other fields`);
      
      // First, check if our specific NFT ID is in the kiosk
      console.log(`\nLooking specifically for NFT ID: ${specificNftId}`);
      const targetField = itemFields.find(field => field.name?.value?.id === specificNftId);
      
      if (targetField) {
        console.log(`FOUND TARGET NFT in kiosk!`);
        console.log(`Field details: ${JSON.stringify(targetField)}`);
        
        try {
          // Get the actual NFT object with all details
          console.log(`Fetching full NFT object...`);
          const nftObj = await suiClient.getObject({
            id: specificNftId,
            options: { showDisplay: true, showContent: true, showType: true }
          });
          
          if (nftObj.data) {
            console.log(`\nNFT Type: ${nftObj.data.type}`);
            console.log(`NFT Display: ${JSON.stringify(nftObj.data.display, null, 2)}`);
            
            // Check if it's a SUDOZ NFT
            const isSudozNft = nftObj.data.type === targetNFTType || 
                              nftObj.data.type.includes('_sudoz_artifacts::Nft') || 
                              nftObj.data.type.includes(targetPackageId);
            
            console.log(`Is this a SUDOZ NFT? ${isSudozNft ? 'YES!' : 'No'}`);
            
            // Check if this item is listed for sale
            const isListed = listingFields.some(listing => {
              return listing.name?.type === LISTING_TYPE && 
                     listing.name?.value?.id === specificNftId;
            });
            
            console.log(`Is this NFT listed for sale? ${isListed ? 'Yes' : 'No'}`);
          } else {
            console.log(`NFT object data not available`);
          }
        } catch (nftError) {
          console.error(`Error fetching NFT details: ${nftError.message}`);
        }
      } else {
        console.log(`Target NFT not found in this kiosk`);
      }
      
      // Examine all items in the kiosk
      console.log('\nExamining all items in the kiosk:');
      
      for (let i = 0; i < itemFields.length; i++) {
        const field = itemFields[i];
        console.log('-------------------------------------------');
        console.log(`Item Field ${i+1}: ${JSON.stringify(field.name)}`);
        const itemId = field.name?.value?.id;
        
        if (itemId) {
          console.log(`Item ID: ${itemId}`);
          
          try {
            // Get just the type of the NFT to avoid timeouts
            console.log(`Fetching NFT type...`);
            const nftObj = await suiClient.getObject({
              id: itemId,
              options: { showType: true }
            });
            
            if (nftObj.data) {
              const nftType = nftObj.data.type;
              console.log(`NFT type: ${nftType}`);
              
              // Use flexible matching to check if it's a SUDOZ NFT
              const isSudozNft = nftType && (
                nftType === targetNFTType ||
                nftType.includes('_sudoz_artifacts::Nft') ||
                nftType.includes(targetPackageId)
              );
              
              console.log(`Is this a SUDOZ NFT? ${isSudozNft ? 'YES!' : 'No'}`);
            } else {
              console.log(`NFT type not available`);
            }
          } catch (error) {
            console.log(`Error fetching NFT type: ${error.message}`);
          }
        }
      }
    }
    
    console.log('\n=== EXAMINATION COMPLETED ===');
  } catch (error) {
    console.error('Examination failed with error:', error);
  }
}

// Main function to run tests
async function runTests() {
  console.log('=== STARTING KIOSK NFT FETCH TEST ===');
  
  // Examine the specific kiosk and NFT provided by the user
  await examineSpecificKiosk();
  
  // Optionally test with a wallet address
  // console.log(`\nTesting wallet: ${testWalletAddress}`);
  // await testFetchNFTs(testWalletAddress);
  
  console.log('=== TEST COMPLETED ===');
}

// Run the tests
runTests();
