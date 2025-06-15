"use client"

import { ConnectButton, useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit'
import { useTerms } from './TermsContext'

export default function WalletConnect() {
  const account = useCurrentAccount();
  const disconnect = useDisconnectWallet();
  const { termsAccepted, setShowTermsDialog } = useTerms();

  const handleConnectClick = () => {
    if (!termsAccepted) {
      setShowTermsDialog(true);
    }
  };

  const handleDisconnect = () => {
    disconnect.mutate();
  };

  return (
    <div className="wallet-button-container">
      {!account ? (
        termsAccepted ? (
          <ConnectButton />
        ) : (
          <button
            onClick={handleConnectClick}
            className="px-4 py-2 rounded-xl bg-gray-600/20 text-gray-400 border border-gray-600/40 text-sm font-bold tracking-wide hover:bg-gray-600/30 transition-colors"
          >
            CONNECT WALLET
          </button>
        )
      ) : (
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 rounded-xl bg-green-400/20 text-green-400 border border-green-400/40 text-sm font-bold tracking-wide hover:bg-green-400/30 transition-colors truncate max-w-[180px]"
          title={`Connected: ${account.address}`}
        >
          {account.address.slice(0, 6)}...{account.address.slice(-4)}
        </button>
      )}
    </div>
  );
}