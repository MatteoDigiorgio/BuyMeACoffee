"use client";
import abi from "../../utils/BuyMeACoffee.json";
import { ethers } from "ethers";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import {
  useAccount,
  useConnect,
  useContractWrite,
  useContractRead,
  usePrepareContractWrite,
} from "wagmi";

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

  useEffect(() => {
    let buyMeACoffee;
  }, []);
  return (
    <div className={styles.container}>
      <Head>
        <title>Buy Matteo a Coffee!</title>
        <meta name="description" content="Tipping site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Buy Matteo a Coffee!</h1>

        {isConnected ? (
          <>
            {isConnected && <div>Connected to {activeConnector?.name}</div>}
            <div>
              <form>
                <div className="formgroup">
                  <label>Name</label>
                  <br />

                  <input
                    id="name"
                    type="text"
                    placeholder="anon"
                    onChange={onNameChange}
                  />
                </div>
                <br />
                <div className="formgroup">
                  <label>Send Matteo a message</label>
                  <br />

                  <textarea
                    rows={3}
                    placeholder="Enjoy your coffee!"
                    id="message"
                    onChange={onMessageChange}
                    required
                  ></textarea>
                </div>
                <div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      write?.();
                    }}
                    type="button"
                  >
                    Send 1 Coffee for 0.001ETH
                  </button>
                  {isLoadingWrite && <div>Check Wallet</div>}
                  {isSuccess && <div>Transaction: {JSON.stringify(buy)}</div>}
                </div>
              </form>
            </div>
          </>
        ) : (
          <>
            {connectors.map((connector) => (
              <button
                disabled={!connector.ready}
                key={connector.id}
                onClick={() => connect({ connector })}
              >
                {connector.name}
                {isLoading &&
                  pendingConnector?.id === connector.id &&
                  " (connecting)"}
              </button>
            ))}
          </>
        )}
      </main>

      {isConnected && <h1>Memos received</h1>}

      {isConnected &&
        getMemos() &&
        memos?.map((memo, idx) => {
          return (
            <div
              key={idx}
              style={{
                border: "2px solid",
                "border-radius": "5px",
                padding: "5px",
                margin: "5px",
              }}
            >
              <p style={{ "font-weight": "bold" }}>"{memo.message}"</p>
              <p>
                From: {memo.name} at {memo.timestamp.toString()}
              </p>
            </div>
          );
        })}

      <footer className={styles.footer}>
        <a
          href="https://github.com/MatteoDigiorgio/BuyMeACoffee"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created by @matteodigiorgio
        </a>
      </footer>
    </div>
  );
}
