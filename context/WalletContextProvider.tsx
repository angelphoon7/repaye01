import { createContext, useContext, ReactNode, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import '../styles/wallet-adapter.css';
import React from 'react';

interface WalletContextType {
  wallet: any;
  setWallet: (wallet: any) => void;
  connected: boolean;
  setConnected: (connected: boolean) => void;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  setWallet: () => {},
  connected: false,
  setConnected: () => {},
});

interface Props {
  children: ReactNode;
}

export const WalletContextProvider = ({ children }: Props) => {
  const [wallet, setWallet] = useState<any>(null);
  const [connected, setConnected] = useState(false);

  const endpoint = clusterApiUrl('devnet');
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletContext.Provider value={{ wallet, setWallet, connected, setConnected }}>
            {children}
          </WalletContext.Provider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const useWallet = () => useContext(WalletContext); 