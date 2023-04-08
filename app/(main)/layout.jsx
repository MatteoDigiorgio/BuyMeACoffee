"use client";
import React from "react";
import "./globals.css";

import { sepolia } from "@wagmi/chains";
import { createClient, configureChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { WagmiConfig } from "wagmi";

import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const { chains, provider } = configureChains(
  [sepolia],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: "https://eth-sepolia.g.alchemy.com/v2/UoGnd1RFhJrl9rc0nbSgW529Zipuihfd",
      }),
    }),
  ]
);

export const client = createClient({
  autoConnect: true,
  provider,
});

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <title>Buy Me A Coffee</title>
      </head>
      <body>
        <WagmiConfig client={client}>
          {/* <Header /> */}
          {children}
        </WagmiConfig>
      </body>
    </html>
  );
}
