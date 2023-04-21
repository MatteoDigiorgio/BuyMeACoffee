"use client";
import React from "react";
import abi from "../../utils/BuyMeACoffee.json";
import { useContractRead } from "wagmi";
import moment from "moment";

function Memos() {
  // Contract Address & ABI
  const contractAddress = "0x495e2845B5C6EFFCB4C1D0e2710014E508b2b551";
  const contractABI = abi.abi;

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

  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    console.log("fetching memos from the blockchain..");
    useContractRead();
    console.log("fetched!");
  };

  return (
    getMemos() &&
    memos?.map((memo, idx) => {
      return (
        <div
          key={idx}
          className="w-60 p-6 border border-[#6F4E37] rounded-lg shadow shadow-lg bg-[#DDB694]"
        >
          <p className="flex justify-end italic text-xs text-[#6F4E37]">
            {moment.unix(memo.timestamp.toString()).format("MMMM Do, YYYY")}
          </p>
          <p className="mb-2 text-2xl font-bold tracking-tight text-[#6F4E37]">
            "{memo.message}"
          </p>
          <p className="mb-3 font-normal text-[#6F4E37]">By {memo.name}</p>
        </div>
      );
    })
  );
}

export default Memos;
