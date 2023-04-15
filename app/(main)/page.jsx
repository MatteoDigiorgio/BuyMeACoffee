"use client";
import abi from "../../utils/BuyMeACoffee.json";
import { ethers } from "ethers";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useContractWrite,
  useContractRead,
  usePrepareContractWrite,
} from "wagmi";
import moment from "moment";
import metamask from "../../public/metamask.svg";
import coinbase from "../../public/coinbase.svg";
import wallet from "../../public/wallet.svg";
// import injected from "../../public/injected.svg";

export default function Home() {
  // Component state
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  // Contract Address & ABI
  const contractAddress = "0x495e2845B5C6EFFCB4C1D0e2710014E508b2b551";
  const contractABI = abi.abi;

  // Config
  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: "buyCoffee",
    args: [name, message],
    overrides: {
      value: ethers.utils.parseEther("0.01"),
    },
    onError(error) {
      console.log("Error", error);
    },
    onSuccess(data) {
      console.log("Success", data);
    },
  });
  const {
    data: buy,
    isLoadingWrite,
    isSuccess,
    write,
  } = useContractWrite(config);

  const {
    data: memos,
    isError,
    isLoadingRead,
  } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: "getMemos",
    watch: true,
    onError(error) {
      console.log("Error", error);
    },
    onSuccess(data) {
      console.log("Success", data);
    },
  });

  const { connector: activeConnector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  };

  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    console.log("fetching memos from the blockchain..");
    useContractRead();
    console.log("fetched!");
  };

  const connectorsStyle = [
    {
      id: "metaMask",
      svg: metamask,
      style:
        "ring-metamask-500 shadow-metamask-400/50 text-metamask-500 hover:from-metamask-500 hover:to-metamask-700 hover:ring-metamask-700 hover:shadow-lg hover:shadow-metamask-500/50",
    },
    {
      id: "coinbaseWallet",
      svg: coinbase,
      style:
        "ring-coinbase-600 shadow-coinbase-400/50 text-coinbase-600 hover:from-coinbase-600 hover:to-coinbase-800 hover:ring-coinbase-800 hover:shadow-lg hover:shadow-coinbase-600/50",
    },
    {
      id: "walletConnect",
      svg: wallet,
      style:
        "ring-wallet-600 shadow-wallet-400/50 text-wallet-600 hover:from-wallet-600 hover:to-wallet-800 hover:ring-wallet-800 hover:shadow-lg hover:shadow-wallet-600/50",
    },
    {
      id: "injected",
      svg: "→",
      style:
        "ring-injected-600 shadow-injected-400/50 text-injected-600 hover:from-injected-600 hover:to-injected-800 hover:ring-injected-800 hover:shadow-lg hover:shadow-injected-600/50",
    },
  ];

  useEffect(() => {
    let buyMeACoffee;
  }, []);
  return (
    <div className="px-2 min-h-screen bg-[#EFDECD] bg-coffee_wave bg-cover flex flex-col justify-center items-center ">
      <Head>
        <title>Buy Matteo a Coffee!</title>
        <meta name="description" content="Tipping site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col justify-center items-center py-20">
        <h1 className="flex-wrap m-10 p-10 text-6xl text-center font-bold whitespace-normal">
          Buy{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-800  bg-clip-text text-transparent font-extrabold">
            Matteo
          </span>{" "}
          a Coffee!
        </h1>

        {isConnected ? (
          <>
            {isConnected && (
              <>
                <div className="absolute top-5 right-5 italic font-extralight">
                  Connected to {activeConnector?.name}
                </div>
                <div
                  className="absolute top-10 right-5 font-bold hover:underline cursor-pointer"
                  onClick={() => disconnect()}
                >
                  Disconnect
                </div>
              </>
            )}
            <div className="w-64 p-5 backdrop-blur-sm bg-white/20 rounded-lg drop-shadow-xl">
              <form className="w-full">
                {/* Name */}
                <div className="w-full">
                  <label>Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="anon"
                    onChange={onNameChange}
                    className="border-2 border-[#6F4E37] rounded-md p-2 w-full bg-[#FFF7EF] placeholder:italic focus:outline-none focus:ring focus:ring-[#BD865E]"
                  />
                </div>
                {/* Message */}
                <div className="w-full">
                  <label>Send Matteo a message</label>
                  <textarea
                    rows={3}
                    placeholder="Enjoy your coffee!"
                    id="message"
                    onChange={onMessageChange}
                    required
                    className="border-2 border-[#6F4E37] rounded-md p-2 w-full bg-[#FFF7EF] placeholder:italic focus:outline-none focus:ring focus:ring-[#BD865E]"
                  ></textarea>
                </div>
                {/* Button */}
                <div className="flex flex-col content-center w-full mt-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      write?.();
                    }}
                    type="button"
                    className="flex rounded-full p-2 items-center justify-center transition ease-in-out align-middle bg-[#EFDECD] hover:-translate-y-1 hover:scale-105 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-800 text-[#647cf6] hover:text-white duration-300 hover:ring hover:ring-blue-900 hover:shadow-lg hover:shadow-blue-900/50"
                  >
                    <span className="text-lg text-black ">0.001 ETH</span>
                    <svg
                      width="20"
                      height="20"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fab"
                      data-icon="ethereum"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path
                        fill="currentColor"
                        d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"
                      ></path>
                    </svg>
                    <span className="text-2xl text-black">→ ☕️</span>
                  </button>
                  {isLoadingWrite && <div>Check Wallet</div>}
                  {isSuccess && <div>Transaction: {JSON.stringify(buy)}</div>}
                </div>
              </form>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center w-64 p-5 backdrop-blur-sm bg-white/20 rounded-lg drop-shadow-xl mx-auto">
              {connectors.map((connector) => (
                <button
                  disabled={!connector.ready}
                  key={connector.id}
                  onClick={() => connect({ connector })}
                  className={`flex rounded-full p-2 my-4 w-40 items-center justify-center transition ease-in-out align-middle bg-[#EFDECD] ring shadow-lg hover:-translate-y-1 hover:scale-105 hover:bg-gradient-to-r duration-300 hover:ring hover:text-white 
                ${connectorsStyle.map((connectorStyle) =>
                  connectorStyle.id === connector.id ? connectorStyle.style : ""
                )}`}
                >
                  {connector.name}
                  {isLoading &&
                    pendingConnector?.id === connector.id &&
                    " (connecting)"}
                </button>
              ))}
            </div>
          </>
        )}
      </main>
      {isConnected && <h1>Memos received</h1>}
      <div className="flex">
        {isConnected &&
          getMemos() &&
          memos?.map((memo, idx) => {
            return (
              <div key={idx} className="rounded border-2 p-2 m-2">
                <p className="font-bold">"{memo.message}"</p>
                <p>
                  {memo.name} at{" "}
                  {moment
                    .unix(memo.timestamp.toString())
                    .format("MMMM Do, YYYY")}
                </p>
              </div>
            );
          })}
      </div>
      <footer className="w-full h-24 flex mt-12 justify-center items-center border-t border-black">
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
