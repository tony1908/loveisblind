"use client";

import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { parseEther, encodeFunctionData } from "viem";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/navigation";

export default function RefuelPage() {
  // Replace with your actual contract address.
  const contractAddress = "0x95DB390Cd80D21c455FAF27e520AEabE3e0f0eDD";
  // Amount to stake: 1 token in human-readable form.
  const stakeAmount = "1"; // 1 token

  const stakeAbi = [
    {
      inputs: [],
      name: "stake",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
  ];

  const { primaryWallet } = useDynamicContext();
  const router = useRouter();
  if (!primaryWallet) {
    console.error("No primary wallet found in dynamic context");
    return <div>Please connect your wallet via Dynamic Labs.</div>;
  }

  // Local state to track transaction status
  const [txStatus, setTxStatus] = useState<"idle" | "loading" | "success">("idle");
  const [txHash, setTxHash] = useState<string | undefined>(undefined);

  // Modified function to automatically process payment and route to partners regardless of outcome
  const handlePayment = async () => {
    console.log("Initiating transaction...");
    try {
      setTxStatus("loading");

      console.log("Encoding stake() function call...");
      const encodedData = encodeFunctionData({
        abi: stakeAbi,
        functionName: "stake",
        args: [],
      });
      console.log("Encoded data:", encodedData);

      console.log("Obtaining wallet clients from primaryWallet...");
      // Retrieve the public client (instead of using primaryWallet.address)
      const publicClient = await primaryWallet.connector.getPublicClient();
      // Cast the wallet client to any to avoid unknown type errors.
      const walletClient: any = await primaryWallet.connector.getWalletClient();
      console.log("Obtained clients:", { publicClient, walletClient });

      const transaction = {
        to: contractAddress,
        data: encodedData,
        value: parseEther(stakeAmount),
      };
      console.log("Prepared transaction object:", transaction);

      const hash = await walletClient.sendTransaction(transaction);
      console.log("Transaction sent. Hash:", hash);
      setTxHash(hash);
      setTxStatus("success");
    } catch (error) {
      console.error("Error while sending transaction:", error);
      setTxStatus("idle");
    } finally {
      // Automatically redirect to /partners regardless of the tx outcome
      router.push("/partners");
    }
  };

  // Automatically trigger the payment process when the component mounts.
  useEffect(() => {
    handlePayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-yellow-100">
      <Header />
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-4 text-center">Help Cupid</h1>
        <div className="max-w-lg mx-auto bg-white border-4 border-black p-8 rounded shadow-[4px_4px_0px_0px] transition-transform transform hover:scale-105">
          <p className="mb-4 text-lg">
            Processing transaction, please wait...
          </p>
          {/* Optionally display transaction status/details while processing */}
          {txStatus === "success" && txHash && (
            <div className="mt-4">
              Payment successful!
              <div>
                <a
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  View on Etherscan
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 