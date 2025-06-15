import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

export interface KioskInfo {
  kioskId: string;
  kioskCap: string;
  items: number;
}

export interface KioskSelection {
  kioskId: string;
  kioskCap: string;
  isNew: boolean;
}

export async function getUserKiosks(
  client: SuiClient,
  userAddress: string
): Promise<KioskInfo[]> {
  try {
    // Get all objects owned by the user
    const objects = await client.getOwnedObjects({
      owner: userAddress,
      filter: {
        StructType: '0x2::kiosk::KioskOwnerCap',
      },
      options: {
        showType: true,
        showContent: true,
      },
    });

    const kiosks: KioskInfo[] = [];

    for (const obj of objects.data) {
      if (obj.data?.content?.dataType === 'moveObject') {
        const content = obj.data.content as any;
        const kioskId = content.fields?.for;
        
        if (kioskId) {
          // Get kiosk details
          const kioskObj = await client.getObject({
            id: kioskId,
            options: { showContent: true },
          });

          const kioskContent = kioskObj.data?.content as any;
          const itemCount = kioskContent?.fields?.item_count || 0;

          kiosks.push({
            kioskId,
            kioskCap: obj.data.objectId,
            items: parseInt(itemCount),
          });
        }
      }
    }

    return kiosks;
  } catch (error) {
    console.error('Error fetching user kiosks:', error);
    return [];
  }
}

export async function getOrSelectKiosk(
  client: SuiClient,
  userAddress: string
): Promise<{ kioskId: string; kioskCap: string } | null> {
  const kiosks = await getUserKiosks(client, userAddress);
  
  if (kiosks.length === 0) {
    return null;
  }
  
  if (kiosks.length === 1) {
    return {
      kioskId: kiosks[0].kioskId,
      kioskCap: kiosks[0].kioskCap,
    };
  }
  
  // If multiple kiosks, let user choose
  const kioskOptions = kiosks.map((k, i) => 
    `${i + 1}. Kiosk ${i + 1} (${k.items} items) - ${k.kioskId.slice(0, 16)}...`
  ).join('\n');
  
  const selection = prompt(
    `You have ${kiosks.length} kiosks. Which one would you like to use?\n\n${kioskOptions}\n\nEnter number (1-${kiosks.length}):`
  );
  
  if (!selection) return null;
  
  const index = parseInt(selection) - 1;
  if (index >= 0 && index < kiosks.length) {
    return {
      kioskId: kiosks[index].kioskId,
      kioskCap: kiosks[index].kioskCap,
    };
  }
  
  return null;
}

/**
 * Automatic kiosk manager - silently handles kiosk selection/creation
 * - If user has no kiosk: returns null (caller should create new)
 * - If user has kiosk(s): automatically uses the first one
 * - No user prompts, everything automatic
 * 
 * @param client - Sui client
 * @param userAddress - User's address
 * @returns Kiosk selection or null if new kiosk should be created
 */
export async function autoGetOrCreateKiosk(
  client: SuiClient,
  userAddress: string
): Promise<KioskSelection | null> {
  try {
    const kiosks = await getUserKiosks(client, userAddress);
    
    // No kiosks exist - signal to create new one
    if (kiosks.length === 0) {
      console.log('No existing kiosks found, will create new one');
      return null;
    }
    
    // Use first kiosk automatically (no prompts)
    console.log(`Auto-selecting kiosk: ${kiosks[0].kioskId}`);
    return {
      kioskId: kiosks[0].kioskId,
      kioskCap: kiosks[0].kioskCap,
      isNew: false
    };
    
  } catch (error) {
    console.error('Error in autoGetOrCreateKiosk:', error);
    return null; // Signal to create new on error
  }
}

/**
 * Get existing kiosk or create instructions to create a new one
 * This version ensures we always have a kiosk to work with
 */
export async function ensureKiosk(
  client: SuiClient,
  userAddress: string,
  tx: Transaction
): Promise<{ kioskId: string | any; kioskCap: string | any; isNew: boolean }> {
  try {
    const kiosks = await getUserKiosks(client, userAddress);
    
    if (kiosks.length > 0) {
      // Use first existing kiosk
      console.log('Using existing kiosk:', kiosks[0].kioskId);
      return {
        kioskId: tx.object(kiosks[0].kioskId),
        kioskCap: tx.object(kiosks[0].kioskCap),
        isNew: false
      };
    } else {
      // Create new kiosk in the same transaction
      console.log('Creating new kiosk in transaction');
      const [kiosk, kioskCap] = tx.moveCall({
        target: '0x2::kiosk::new',
        arguments: [],
      });
      
      // Don't share the kiosk here - let the caller handle it
      // This allows the kiosk to be used as a mutable reference first
      
      return {
        kioskId: kiosk,
        kioskCap: kioskCap,
        isNew: true
      };
    }
  } catch (error) {
    console.error('Error in ensureKiosk:', error);
    throw error;
  }
}