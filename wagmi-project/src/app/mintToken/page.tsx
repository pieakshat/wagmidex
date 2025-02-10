"use client"

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import MintTokenAbi from '../../abis/mint.json';

const ALICE_TOKEN_ADDRESS = "0x501d826490c6E34Abf4cde1Ac6E1091FdA8A8Cce";
const BOB_TOKEN_ADDRESS = "0x15B956FA3948C9e0ac232d917CdB6F4BcDbd1dF1";

const MintToken = () => {
    const { address, isConnected } = useAccount();
    const { writeContractAsync } = useWriteContract();

    const [tokenAddress, setTokenAddress] = useState<`0x${string}`>(ALICE_TOKEN_ADDRESS);
    const [isMinting, setIsMinting] = useState(false);

    const handleMint = async () => {
        if (!isConnected) {
            alert("Please connect your wallet to mint tokens.");
            return;
        }

        try {
            setIsMinting(true);
            await writeContractAsync({
                address: tokenAddress,
                abi: MintTokenAbi,
                functionName: 'mintTokens',
            });
            alert("Tokens minted successfully!");
        } catch (error) {
            console.error("Minting failed:", error);
            alert("Minting failed. Check the console for details.");
        } finally {
            setIsMinting(false);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Mint Tokens</h2>
            <label className="block mb-2 font-medium">Select Token:</label>
            <select
                className="w-full p-2 border rounded mb-4"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value as `0x${string}`)}
            >
                <option value={ALICE_TOKEN_ADDRESS}>Alice Token</option>
                <option value={BOB_TOKEN_ADDRESS}>Bob Token</option>
            </select>
            <button
                onClick={handleMint}
                disabled={isMinting}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {isMinting ? "Minting..." : "Mint Tokens"}
            </button>
        </div>
    );
};

export default MintToken;
