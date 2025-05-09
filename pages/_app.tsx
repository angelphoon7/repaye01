import type { AppProps } from 'next/app';
import { WalletContextProvider } from '../context/WalletContextProvider';
import '../styles/globals.css';
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletContextProvider>
      <Component {...pageProps} />
    </WalletContextProvider>
  );
}

export default MyApp; 