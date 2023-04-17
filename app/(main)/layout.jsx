"use client";
import React, { useEffect, useState } from "react";
import "./globals.css";

import { sepolia } from "@wagmi/chains";
import { createClient, configureChains } from "wagmi";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { WagmiConfig } from "wagmi";

import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const { chains, provider, webSocketProvider } = configureChains(
  [sepolia],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: "https://eth-sepolia.g.alchemy.com/v2/UoGnd1RFhJrl9rc0nbSgW529Zipuihfd",
      }),
    }),
  ]
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: "...",
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

export default function RootLayout({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);
  return (
    <html>
      <head>
        <title>Buy Me A Coffee</title>
      </head>
      <body>
        {ready ? (
          <WagmiConfig client={client}>
            {/* <Header /> */}
            {children}
          </WagmiConfig>
        ) : (
          <div className="px-2 min-h-screen bg-[#EFDECD] bg-coffee_wave bg-cover flex flex-col justify-center items-center ">
            <main className="flex flex-col justify-center items-center py-10">
              <h1 className="flex-wrap m-10 p-10 text-6xl text-center font-bold whitespace-normal">
                Buy{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-800  bg-clip-text text-transparent font-extrabold">
                  Matteo
                </span>{" "}
                a Coffee!
              </h1>

              <div className="w-64 p-5 backdrop-blur-sm bg-white/20 rounded-lg drop-shadow-xl mx-auto">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-6 py-1">
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-2 bg-slate-300 rounded col-span-1"></div>
                      </div>
                      <div className="h-8 bg-slate-300 rounded"></div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-2 bg-slate-300 rounded col-span-2"></div>
                      </div>
                      <div className="h-20 bg-slate-300 rounded"></div>
                      <div className="h-12 bg-slate-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </main>

            <footer className="w-full h-24 flex mt-12 justify-center items-center ">
              <a
                href="https://github.com/MatteoDigiorgio/BuyMeACoffee"
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center flex-grow"
              >
                Created by @matteodigiorgio
              </a>
            </footer>
          </div>
        )}
      </body>
    </html>
  );
}
