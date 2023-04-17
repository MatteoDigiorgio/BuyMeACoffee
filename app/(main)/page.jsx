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
      svg: "/metamask.svg",
      style:
        "ring-metamask-500 shadow-metamask-400/50 text-metamask-500 hover:from-metamask-400 hover:to-metamask-600 hover:ring-metamask-700 hover:shadow-lg hover:shadow-metamask-500/50",
    },
    {
      id: "coinbaseWallet",
      svg: "/coinbase.svg",
      style:
        "ring-coinbase-600 shadow-coinbase-400/50 text-coinbase-600 hover:from-coinbase-500 hover:to-coinbase-700 hover:ring-coinbase-800 hover:shadow-lg hover:shadow-coinbase-600/50",
    },
    {
      id: "walletConnect",
      svg: "/wallet.svg",
      style:
        "ring-wallet-600 shadow-wallet-400/50 text-wallet-600 hover:from-wallet-600 hover:to-wallet-800 hover:ring-wallet-800 hover:shadow-lg hover:shadow-wallet-600/50",
    },
    {
      id: "injected",
      svg: "/inject.svg",
      style:
        "ring-injected-600 shadow-injected-400/50 text-injected-600 hover:from-injected-600 hover:to-injected-800 hover:ring-injected-800 hover:shadow-lg hover:shadow-injected-600/50",
    },
  ];

  useEffect(() => {
    let buyMeACoffee;
  }, []);
  return (
    <div className="px-2 min-h-full max-h-full bg-[#EFDECD] bg-coffee_wave bg-cover flex flex-col justify-center items-center ">
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

        {isConnected ? (
          <>
            {console.log(localStorage.getItem("wagmi.wallet"))}
            {isConnected && (
              <>
                <div className="flex absolute top-5 right-5 italic font-extralight items-center gap-2">
                  Connected to {activeConnector?.name}{" "}
                  {connectorsStyle.map((connectorStyle) =>
                    connectorStyle.id ===
                    JSON.parse(localStorage.getItem("wagmi.wallet")) ? (
                      <img
                        src={connectorStyle.svg}
                        alt={`${connectorStyle.id} Logo`}
                        className="w-4 h-4"
                      />
                    ) : null
                  )}
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
                  <p className="pb-2">Name</p>
                  <input
                    id="name"
                    type="text"
                    placeholder="Satoshi Nakamoto"
                    onChange={onNameChange}
                    className="border-2 border-[#6F4E37] rounded-md p-2 w-full bg-[#FFF7EF] placeholder:italic focus:outline-none focus:ring focus:ring-[#BD865E]"
                  />
                </div>
                {/* Message */}
                <div className="w-full">
                  <p className="py-2">Send Matteo a message</p>
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
                    <span className="text-2xl text-black">→</span>
                    <img
                      src="/coffee.svg"
                      alt="Coffee Logo"
                      className="w-4 h-4 ml-2"
                    />
                  </button>
                </div>
              </form>
            </div>
            {isSuccess && (
              <div className="m-4 p-2 border border-[#6F4E37] rounded-lg shadow shadow-lg bg-[#DDB694]">
                Transaction: {JSON.stringify(buy.hash)}
              </div>
            )}
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
                    ${connectorsStyle
                      .map((connectorStyle) =>
                        connectorStyle.id === connector.id
                          ? connectorStyle.style
                          : null
                      )
                      .join("")}`}
                >
                  {connectorsStyle.map((connectorStyle) =>
                    connectorStyle.id === connector.id ? (
                      isLoading && pendingConnector?.id === connector.id ? (
                        <svg
                          aria-hidden="true"
                          class="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                      ) : (
                        <img
                          src={connectorStyle.svg}
                          alt={`${connectorStyle.id} Logo`}
                          className="w-4 h-4 mr-2"
                        />
                      )
                    ) : null
                  )}
                  {connector.name}
                </button>
              ))}
            </div>
          </>
        )}
      </main>

      <div className="grid grid-col-1 mt-8 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {isConnected &&
          getMemos() &&
          memos?.map((memo, idx) => {
            return (
              <div
                key={idx}
                className="w-60 p-6 border border-[#6F4E37] rounded-lg shadow shadow-lg bg-[#DDB694]"
              >
                <p className="flex justify-end italic text-xs text-[#6F4E37]">
                  {moment
                    .unix(memo.timestamp.toString())
                    .format("MMMM Do, YYYY")}
                </p>
                <p className="mb-2 text-2xl font-bold tracking-tight text-[#6F4E37]">
                  "{memo.message}"
                </p>
                <p className="mb-3 font-normal text-[#6F4E37]">
                  By {memo.name}
                </p>
              </div>
            );
          })}
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
