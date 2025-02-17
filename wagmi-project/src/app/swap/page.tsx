"use client"
import { useState, useEffect } from "react";
import { parseEther, formatEther } from "viem";
import { useAccount, useReadContract, useWriteContract, useBalance } from "wagmi";
import TokenAbi from '../../abis/token.json';
import DexAbi from '../../abis/dex.json';
import { DEX_ADDRESS, ALICE_TOKEN_ADDRESS, BOB_TOKEN_ADDRESS } from "../page";
import { Navbar } from "../components/navbar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, ArrowDown, ChevronDown, InfoIcon } from 'lucide-react';

type Token = {
    symbol: string;
    address: `0x${string}` | "ETH";
    icon?: string;
};

type PoolInfo = {
    poolAddress: string;
    price: bigint;
    ethReserve: bigint;
    tokenReserve: bigint;
};



const SwapInterface = () => {
    const { address, isConnected } = useAccount();
    const { writeContractAsync } = useWriteContract();

    const { data: pools } = useReadContract({
        address: DEX_ADDRESS,
        abi: DexAbi,
        functionName: "getAllPoolsInfo",
        query: {
            select: (data) => data as PoolInfo[],
        }
    });

    const tokens: Token[] = [
        { symbol: "ETH", address: "ETH", icon: "🔷" },
        { symbol: "ALICE", address: ALICE_TOKEN_ADDRESS },
        { symbol: "BOB", address: BOB_TOKEN_ADDRESS }
    ];

    const [selectedToken1, setSelectedToken1] = useState<Token>(tokens[0]);
    const [selectedToken2, setSelectedToken2] = useState<Token>(tokens[1]);
    const [amount1, setAmount1] = useState("");
    const [amount2, setAmount2] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showTokenList1, setShowTokenList1] = useState(false);
    const [showTokenList2, setShowTokenList2] = useState(false);

    // Calculate output amount based on input amount and pool data
    const calculateOutputAmount = (
        inputAmount: string,
        inputToken: Token,
        outputToken: Token,
        pools: PoolInfo[] | undefined
    ) => {
        if (!pools || !inputAmount || isNaN(Number(inputAmount))) {
            return "0";
        }

        const inputAmountBigInt = parseEther(inputAmount);

        // ETH to Token swap
        if (inputToken.address === "ETH" && outputToken.address !== "ETH") {
            const pool = pools.find(p => p.poolAddress.toLowerCase() === outputToken.address.toLowerCase());
            if (!pool) return "0";

            const outputAmount = (inputAmountBigInt * pool.tokenReserve) / (pool.ethReserve + inputAmountBigInt);
            return formatEther(outputAmount);
        }

        // Token to ETH swap
        else if (inputToken.address !== "ETH" && outputToken.address === "ETH") {
            const pool = pools.find(p => p.poolAddress.toLowerCase() === inputToken.address.toLowerCase());
            if (!pool) return "0";

            const outputAmount = (inputAmountBigInt * pool.ethReserve) / (pool.tokenReserve + inputAmountBigInt);
            return formatEther(outputAmount);
        }

        // Token to Token swap
        else if (inputToken.address !== "ETH" && outputToken.address !== "ETH") {
            const inputPool = pools.find(p => p.poolAddress.toLowerCase() === inputToken.address.toLowerCase());
            const outputPool = pools.find(p => p.poolAddress.toLowerCase() === outputToken.address.toLowerCase());

            if (!inputPool || !outputPool) return "0";

            // First get ETH amount
            const intermediateEthAmount = (inputAmountBigInt * inputPool.ethReserve) / (inputPool.tokenReserve + inputAmountBigInt);
            // Then get output token amount
            const outputAmount = (intermediateEthAmount * outputPool.tokenReserve) / (outputPool.ethReserve + intermediateEthAmount);

            return formatEther(outputAmount);
        }

        return "0";
    };

    // Update amount2 whenever amount1 changes
    useEffect(() => {
        if (amount1) {
            const calculatedAmount = calculateOutputAmount(amount1, selectedToken1, selectedToken2, pools);
            setAmount2(calculatedAmount);
        } else {
            setAmount2("");
        }
    }, [amount1, selectedToken1, selectedToken2, pools]);

    const TokenDropdown = ({ tokens, selectedToken, onSelect, show, setShow }: any) => (
        <div className="relative">
            <button
                onClick={() => setShow(!show)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 rounded-lg hover:bg-zinc-800/50 border border-zinc-700 text-gray-200"
            >
                {selectedToken.icon && <span>{selectedToken.icon}</span>}
                <span>{selectedToken.symbol}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            {show && (
                <div className="absolute top-full mt-2 w-full bg-zinc-900 rounded-lg shadow-lg z-10 border border-zinc-700">
                    {tokens.map((token: Token) => (
                        <button
                            key={token.address}
                            className="w-full px-4 py-2 text-left hover:bg-zinc-800 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2 text-gray-200"
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

    const handleSwap = async () => {
        if (!isConnected) {
            alert("Please connect your wallet first");
            return;
        }

        setIsLoading(true);
        try {
            const parsedAmount = parseEther(amount1);

            if (selectedToken1.address === "ETH" && selectedToken2.address !== "ETH") {
                await writeContractAsync({
                    address: DEX_ADDRESS,
                    abi: DexAbi,
                    functionName: 'ethToTokenSwap',
                    args: [selectedToken2.address, 0],
                    value: parsedAmount
                });
            } else if (selectedToken1.address !== "ETH" && selectedToken2.address === "ETH") {
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
                    args: [selectedToken1.address, parsedAmount, 0]
                });
            } else if (selectedToken1.address !== "ETH" && selectedToken2.address !== "ETH") {
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
                    args: [selectedToken1.address, selectedToken2.address, parsedAmount, 0]
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
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-stone-900 to-neutral-900 text-gray-100">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <Card className="max-w-md mx-auto bg-zinc-800/50 backdrop-blur-lg border-zinc-700">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-2xl text-emerald-400">Swap Tokens</CardTitle>
                                <CardDescription className="text-gray-400">
                                    Trade tokens on DEXchange
                                </CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" className="text-emerald-400">
                                <Settings className="h-5 w-5" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert className="bg-zinc-900/50 border-emerald-800">
                            <InfoIcon className="h-4 w-4 text-emerald-400" />
                            <AlertDescription className="text-gray-300">
                                Swap between ETH and tokens, or directly between tokens.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>You pay</span>
                                    <span>Balance: 0.0</span>
                                </div>
                                <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-lg border border-zinc-700">
                                    <input
                                        type="number"
                                        value={amount1}
                                        onChange={(e) => setAmount1(e.target.value)}
                                        placeholder="0"
                                        className="bg-transparent w-full focus:outline-none text-gray-200"
                                    />
                                    <TokenDropdown
                                        tokens={tokens}
                                        selectedToken={selectedToken1}
                                        onSelect={(token: Token) => {
                                            setSelectedToken1(token);
                                            if (amount1) {
                                                const newAmount = calculateOutputAmount(amount1, token, selectedToken2, pools);
                                                setAmount2(newAmount);
                                            }
                                        }}
                                        show={showTokenList1}
                                        setShow={setShowTokenList1}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full bg-zinc-900/50 hover:bg-zinc-800/50 text-emerald-400"
                                    onClick={() => {
                                        const temp = selectedToken1;
                                        setSelectedToken1(selectedToken2);
                                        setSelectedToken2(temp);
                                        setAmount1(amount2);
                                        setAmount2(amount1);
                                    }}
                                >
                                    <ArrowDown className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>You receive</span>
                                    <span>Balance: 0.0</span>
                                </div>
                                <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-lg border border-zinc-700">
                                    <input
                                        type="number"
                                        value={amount2}
                                        readOnly
                                        placeholder="0"
                                        className="bg-transparent w-full focus:outline-none text-gray-200"
                                    />
                                    <TokenDropdown
                                        tokens={tokens}
                                        selectedToken={selectedToken2}
                                        onSelect={(token: Token) => {
                                            setSelectedToken2(token);
                                            if (amount1) {
                                                const newAmount = calculateOutputAmount(amount1, selectedToken1, token, pools);
                                                setAmount2(newAmount);
                                            }
                                        }}
                                        show={showTokenList2}
                                        setShow={setShowTokenList2}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleSwap}
                            disabled={!isConnected || isLoading || !amount1 || !amount2}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Swapping..." : !isConnected ? "Connect Wallet" : "Swap"}
                        </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default SwapInterface;