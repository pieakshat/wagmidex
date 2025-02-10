"use client"
import { useState, useEffect } from "react";
import { parseEther, formatEther } from "viem";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import TokenAbi from '../../abis/token.json';
import DexAbi from '../../abis/dex.json';
import { DEX_ADDRESS } from "../page";

const SwapInterface = () => {
    const { address, isConnected } = useAccount();
    const { writeContractAsync } = useWriteContract();

    // State for input tokens and amounts
    const [token1Address, setToken1Address] = useState<`0x${string}`>("0x");
    const [token2Address, setToken2Address] = useState<`0x${string}`>("0x");
    const [amount1, setAmount1] = useState("");
    const [amount2, setAmount2] = useState("");
    const [isToken1Native, setIsToken1Native] = useState(false);
    const [isToken2Native, setIsToken2Native] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Function to handle token swaps
    const handleSwap = async () => {
        if (!isConnected) {
            alert("Please connect your wallet first");
            return;
        }

        setIsLoading(true);
        try {
            const parsedAmount = parseEther(amount1);

            // ETH to Token swap
            if (isToken1Native && !isToken2Native) {
                await writeContractAsync({
                    address: DEX_ADDRESS,
                    abi: DexAbi,
                    functionName: 'ethToTokenSwap',
                    args: [token2Address, 0], // minTokensOut set to 0 for demo
                    value: parsedAmount
                });
            }
            // Token to ETH swap
            else if (!isToken1Native && isToken2Native) {
                // First approve DEX to spend tokens
                await writeContractAsync({
                    address: token1Address,
                    abi: TokenAbi,
                    functionName: 'approve',
                    args: [DEX_ADDRESS, parsedAmount]
                });

                await writeContractAsync({
                    address: DEX_ADDRESS,
                    abi: DexAbi,
                    functionName: 'tokenToEthSwap',
                    args: [token1Address, parsedAmount, 0] // minEthOut set to 0 for demo
                });
            }
            // Token to Token swap
            else if (!isToken1Native && !isToken2Native) {
                // First approve DEX to spend tokens
                await writeContractAsync({
                    address: token1Address,
                    abi: TokenAbi,
                    functionName: 'approve',
                    args: [DEX_ADDRESS, parsedAmount]
                });

                await writeContractAsync({
                    address: DEX_ADDRESS,
                    abi: DexAbi,
                    functionName: 'tokenToTokenSwap',
                    args: [token1Address, token2Address, parsedAmount, 0] // minTokensOut set to 0 for demo
                });
            }
        } catch (error) {
            console.error("Swap failed:", error);
            alert("Swap failed. Check console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
            <div className="space-y-4">
                {/* First Token Input */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <input
                            type="number"
                            value={amount1}
                            onChange={(e) => setAmount1(e.target.value)}
                            placeholder="0.0"
                            className="w-2/3 bg-transparent text-2xl outline-none"
                        />
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={token1Address}
                                onChange={(e) => setToken1Address(e.target.value)}
                                placeholder="Token Address"
                                className="w-32 px-2 py-1 text-sm border rounded"
                                disabled={isToken1Native}
                            />
                            <button
                                onClick={() => setIsToken1Native(!isToken1Native)}
                                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                {isToken1Native ? "ETH" : "ERC20"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Swap Direction Arrow */}
                <div className="flex justify-center">
                    <button
                        onClick={() => {
                            setToken1Address(token2Address);
                            setToken2Address(token1Address);
                            setAmount1(amount2);
                            setAmount2(amount1);
                            setIsToken1Native(isToken2Native);
                            setIsToken2Native(isToken1Native);
                        }}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                    >
                        ↓
                    </button>
                </div>

                {/* Second Token Input */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <input
                            type="number"
                            value={amount2}
                            onChange={(e) => setAmount2(e.target.value)}
                            placeholder="0.0"
                            className="w-2/3 bg-transparent text-2xl outline-none"
                        />
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={token2Address}
                                onChange={(e) => setToken2Address(e.target.value)}
                                placeholder="Token Address"
                                className="w-32 px-2 py-1 text-sm border rounded"
                                disabled={isToken2Native}
                            />
                            <button
                                onClick={() => setIsToken2Native(!isToken2Native)}
                                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                {isToken2Native ? "ETH" : "ERC20"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Swap Button */}
                <button
                    onClick={handleSwap}
                    disabled={!isConnected || isLoading}
                    className="w-full py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Swapping..." : isConnected ? "Swap" : "Connect Wallet"}
                </button>
            </div>
        </div>
    );
};

export default SwapInterface;