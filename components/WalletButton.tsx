'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import React from 'react';

export default function WalletButton() {
  const { connected, publicKey, connect, disconnect } = useWallet();

  // Format the wallet address (e.g., BCkA...S5s6)
  const shortAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : '';

  return (
    <div className="flex items-center gap-4">
      {connected ? (
        <>
          <span className="text-green-500 text-base">Wallet Connected</span>
          <span
            className="bg-purple-600 text-white rounded-lg px-5 py-2 font-mono text-lg font-semibold min-w-[150px] text-center"
            style={{ letterSpacing: '0.03em' }}
          >
            {shortAddress}
          </span>
          <button
            onClick={disconnect}
            className="ml-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 text-sm"
          >
            Disconnect
          </button>
        </>
      ) : (
        <button
          onClick={connect}
          className="bg-purple-600 text-white rounded-lg px-5 py-2 font-semibold text-lg hover:bg-purple-700 min-w-[150px]"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
} 