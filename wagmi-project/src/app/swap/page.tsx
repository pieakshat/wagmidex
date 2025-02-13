"use client"
import { useState, useEffect } from "react";
import { parseEther, formatEther } from "viem";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import TokenAbi from '../../abis/token.json';
import DexAbi from '../../abis/dex.json';
import { DEX_ADDRESS, ALICE_TOKEN_ADDRESS, BOB_TOKEN_ADDRESS } from "../page";
// import styles from './styles/SwapInterface.module.css'
import { Settings, ArrowDown, ChevronDown } from 'lucide-react';

// Token options type
type Token = {
    symbol: string;
    address: `0x${string}` | "ETH";
    icon?: string;
};

const SwapInterface = () => {
    const { address, isConnected } = useAccount();
    const { writeContractAsync } = useWriteContract();

    // Available tokens
    const tokens: Token[] = [
        { symbol: "ETH", address: "ETH", icon: "🔷" },
        { symbol: "ALICE", address: ALICE_TOKEN_ADDRESS },
        { symbol: "BOB", address: BOB_TOKEN_ADDRESS }
    ];

    // State
    const [selectedToken1, setSelectedToken1] = useState<Token>(tokens[0]);
    const [selectedToken2, setSelectedToken2] = useState<Token>(tokens[1]);
    const [amount1, setAmount1] = useState("");
    const [amount2, setAmount2] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showTokenList1, setShowTokenList1] = useState(false);
    const [showTokenList2, setShowTokenList2] = useState(false);

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
            if (selectedToken1.address === "ETH" && selectedToken2.address !== "ETH") {
                await writeContractAsync({
                    address: DEX_ADDRESS,
                    abi: DexAbi,
                    functionName: 'ethToTokenSwap',
                    args: [selectedToken2.address, 0], // minTokensOut set to 0 for demo
                    value: parsedAmount
                });
            }
            // Token to ETH swap
            else if (selectedToken1.address !== "ETH" && selectedToken2.address === "ETH") {
                // First approve DEX to spend tokens
                await writeContractAsync({
                    address: selectedToken1.address,
                    abi: TokenAbi,
                    functionName: 'approve',
                    args: [DEX_ADDRESS, parsedAmount]
                });

                await writeContractAsync({
                    address: DEX_ADDRESS,
                    abi: DexAbi,
                    functionName: 'tokenToEthSwap',
                    args: [selectedToken1.address, parsedAmount, 0] // minEthOut set to 0 for demo
                });
            }
            // Token to Token swap
            else if (selectedToken1.address !== "ETH" && selectedToken2.address !== "ETH") {
                // First approve DEX to spend tokens
                await writeContractAsync({
                    address: selectedToken1.address,
                    abi: TokenAbi,
                    functionName: 'approve',
                    args: [DEX_ADDRESS, parsedAmount]
                });

                await writeContractAsync({
                    address: DEX_ADDRESS,
                    abi: DexAbi,
                    functionName: 'tokenToTokenSwap',
                    args: [selectedToken1.address, selectedToken2.address, parsedAmount, 0] // minTokensOut set to 0 for demo
                });
            }
        } catch (error) {
            console.error("Swap failed:", error);
            alert("Swap failed. Check console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    // Token selection dropdown component
    const TokenDropdown = ({ tokens, selectedToken, onSelect, show, setShow }: any) => (
        <div className="relative">
            <button
                onClick={() => setShow(!show)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
            >
                {selectedToken.icon && <span>{selectedToken.icon}</span>}
                <span>{selectedToken.symbol}</span>
                <ChevronDown size={16} />
            </button>
            {show && (
                <div className="absolute top-full mt-2 w-full bg-gray-800 rounded-lg shadow-lg z-10">
                    {tokens.map((token: Token) => (
                        <button
                            key={token.address}
                            className="w-full px-4 py-2 text-left hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2"
                            onClick={() => {
                                onSelect(token);
                                setShow(false);
                            }}
                        >
                            {token.icon && <span>{token.icon}</span>}
                            {token.symbol}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <nav className="flex justify-between items-center mb-8">
                <div className="text-xl font-bold">Swap</div>
                <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
                    {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect Wallet"}
                </button>
            </nav>

            <div className="max-w-md mx-auto bg-gray-800 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Swap</h2>
                    <button className="p-2 hover:bg-gray-700 rounded-lg">
                        <Settings size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* First Token Section */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>You pay</span>
                            <span>Balance: 0.0</span>
                        </div>
                        <div className="flex items-center gap-4 bg-gray-700 p-4 rounded-lg">
                            <input
                                type="number"
                                value={amount1}
                                onChange={(e) => setAmount1(e.target.value)}
                                placeholder="0"
                                className="bg-transparent w-full focus:outline-none"
                            />
                            <TokenDropdown
                                tokens={tokens}
                                selectedToken={selectedToken1}
                                onSelect={setSelectedToken1}
                                show={showTokenList1}
                                setShow={setShowTokenList1}
                            />
                        </div>
                    </div>

                    {/* Swap Direction Button */}
                    <div className="flex justify-center">
                        <button
                            className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"
                            onClick={() => {
                                const temp = selectedToken1;
                                setSelectedToken1(selectedToken2);
                                setSelectedToken2(temp);
                                setAmount1(amount2);
                                setAmount2(amount1);
                            }}
                        >
                            <ArrowDown size={20} />
                        </button>
                    </div>

                    {/* Second Token Section */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>You receive</span>
                            <span>Balance: 0.0</span>
                        </div>
                        <div className="flex items-center gap-4 bg-gray-700 p-4 rounded-lg">
                            <input
                                type="number"
                                value={amount2}
                                onChange={(e) => setAmount2(e.target.value)}
                                placeholder="0"
                                className="bg-transparent w-full focus:outline-none"
                            />
                            <TokenDropdown
                                tokens={tokens}
                                selectedToken={selectedToken2}
                                onSelect={setSelectedToken2}
                                show={showTokenList2}
                                setShow={setShowTokenList2}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSwap}
                        disabled={!isConnected || isLoading}
                        className="w-full py-4 bg-blue-600 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
                    >
                        {isLoading ? "Swapping..." : !isConnected ? "Connect Wallet" : "Swap"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SwapInterface;