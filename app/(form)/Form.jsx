"use client";
import React, { useState } from "react";
import abi from "../../utils/BuyMeACoffee.json";
import { ethers } from "ethers";
import {
  useAccount,
  useDisconnect,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";

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

function Form() {
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

  const { connector: activeConnector } = useAccount();

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const { disconnect } = useDisconnect();
  const {
    data: buy,
    isLoadingWrite,
    isSuccess,
    write,
  } = useContractWrite(config);
  return (
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
  );
}

export default Form;
