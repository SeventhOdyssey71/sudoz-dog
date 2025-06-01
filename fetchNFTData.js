import { SuiClient } from '@mysten/sui.js/client';

const targetNFTType = "0xd44eeba23c7256b426113b5b645638f00abc0f27ec224f7286be6f9853df8a5a::_sudoz_artifacts::Nft";

/**
 * Fetches NFT data for a given wallet address and a specific NFT type.
 * @param {string} walletAddress The wallet address to fetch NFTs for.
 * @returns {Promise<Array<Object> | null>} A promise that resolves with an array of NFT objects or null if none found/error.
 */
export async function fetchNFTDataForWallet(walletAddress) {
  // Replace with your desired RPC URL (e.g., from Sui documentation or a provider like Alchemy/Infura)
  const suiClient = new SuiClient({ url: 'https://fullnode.mainnet.sui.io:443' });

  try {
    const ownedObjects = await suiClient.getOwnedObjects({
      owner: walletAddress,
      filter: {
        StructType: targetNFTType,
      },
      options: {
        showDisplay: true,
        showContent: true,
      },
    });

    if (ownedObjects.data.length > 0) {
      // Return all found objects for this type
      return ownedObjects.data;
    } else {
      // No NFTs of the target type found for this wallet
      return [];
    }
  } catch (error) {
    console.error("Error fetching NFT data:", error);
    // Return null or throw the error depending on how you want to handle it upstream
    return null;
  }
}