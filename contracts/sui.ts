import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { fromB64 } from '@mysten/sui.js/utils';

// Example function to sign a transaction
export async function signTransaction(txb: TransactionBlock, keypair: Ed25519Keypair) {
  const serializedTx = await txb.serialize();
  const txBytes = fromB64(serializedTx);
  const signature = await keypair.signTransactionBlock(txBytes);
  return signature;
}

// Example function to execute a transaction
export async function executeTransaction(txb: TransactionBlock, keypair: Ed25519Keypair) {
  const client = new SuiClient({ url: 'https://fullnode.mainnet.sui.io' });
  const signature = await signTransaction(txb, keypair);
  const result = await client.executeTransactionBlock({
    transactionBlock: await txb.serialize(),
    signature: signature.toString(),
    options: {
      showEffects: true,
      showEvents: true,
    },
  });
  return result;
}