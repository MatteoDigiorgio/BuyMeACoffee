"use client";
import Head from "next/head";
import Connectors from "../(connectors)/Connectors";
import Form from "../(form)/Form";
import Memos from "../(memos)/Memos";
import React from "react";
import { useAccount } from "wagmi";
import { isMobile } from "react-device-detect";
import WalletConnect from "../(connectors)/WalletConnect";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="px-2 min-h-screen bg-cover bg-center bg-no-repeat bg-[#EFDECD] bg-coffee_wave flex flex-col justify-center items-center">
      <Head>
        <title>Buy Matteo a Coffee!</title>
        <meta name="description" content="Tipping site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col justify-center items-center py-10">
        <h1 className="flex-wrap m-10 p-10 text-6xl text-center font-bold whitespace-normal">
          Buy{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-800  bg-clip-text text-transparent font-extrabold">
            Matteo
          </span>{" "}
          a Coffee!
        </h1>

        {isConnected ? <Form /> : isMobile ? <WalletConnect /> : <Connectors />}
      </main>

      <div className="grid grid-col-1 mt-8 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {isConnected && <Memos />}
      </div>

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
  );
}
