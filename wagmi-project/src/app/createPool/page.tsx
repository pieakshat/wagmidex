"use client";

import { Key, useEffect, useState } from "react";
import { parseEther, formatEther } from "viem";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import TokenABI from "../../abis/token.json";
import DexABI from "../../abis/dex.json";
import { DEX_ADDRESS } from "../page";
import { Navbar } from "../components/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export interface PoolInfo {
    poolAddress: string;
    price: bigint;
    ethReserve: bigint;
    tokenReserve: bigint;
}

function CreatePool() {
    const { address, isConnected } = useAccount();
    const { writeContractAsync } = useWriteContract();
    const { data: pools, refetch } = useReadContract({
        address: DEX_ADDRESS,
        abi: DexABI,
        functionName: "getAllPoolsInfo",
        query: {
            select: (data) => data as PoolInfo[],
        },
    });

    const [tokenAddress, setTokenAddress] = useState<`0x${string}`>("0x");
    const [tokenReserve, setTokenReserve] = useState("");
    const [ethAmount, setEthAmount] = useState("");
    const [isApproving, setIsApproving] = useState(false);
    const [isCreatingPool, setIsCreatingPool] = useState(false);

    useEffect(() => {
        console.log("data: ", pools);
    }, [pools]);

    const handleCreatePool = async () => {
        if (!isConnected || !tokenAddress || !tokenReserve || !ethAmount) {
            alert("Please connect wallet and enter valid values");
            return;
        }

        try {
            setIsApproving(true);
            const approveTx = await writeContractAsync({
                address: tokenAddress,
                abi: TokenABI,
                functionName: "approve",
                args: [DEX_ADDRESS, parseEther(tokenReserve)],
            });
            setIsApproving(false);

            setIsCreatingPool(true);
            const createPoolTx = await writeContractAsync({
                address: DEX_ADDRESS,
                abi: DexABI,
                functionName: "createPool",
                args: [tokenAddress, parseEther(tokenReserve)],
                value: parseEther(ethAmount),
            });
            setIsCreatingPool(false);

            alert("Pool created successfully!");
            refetch();
        } catch (error) {
            console.error("Error creating pool:", error);
            setIsApproving(false);
            setIsCreatingPool(false);
            alert("Transaction failed");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-stone-900 to-neutral-900 text-gray-100">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <Card className="bg-zinc-800/50 backdrop-blur-lg border-zinc-700 mb-8">
                    <CardHeader>
                        <CardTitle className="text-2xl text-emerald-400">Create New Pool</CardTitle>
                        <CardDescription className="text-gray-400">
                            Create a new liquidity pool for token/ETH pair trading
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert className="bg-zinc-900/50 border-emerald-800 py-2 px-3 text-sm">
                            <InfoIcon className="h-3 w-4 text-gray-300" />
                            <AlertDescription className="text-gray-300">
                                Note: This DEX only supports Token/ETH trading pairs. Each token can only have one pool.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Token Address</label>
                            <Input
                                type="text"
                                placeholder="0x..."
                                value={tokenAddress}
                                onChange={(e) => {
                                    let value = e.target.value;
                                    if (value.startsWith("0x")) {
                                        setTokenAddress(value as `0x${string}`);
                                    }
                                }}
                                className="bg-zinc-900/50 border-zinc-700 text-gray-200"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Token Reserve</label>
                            <Input
                                type="text"
                                placeholder="Token Reserve Amount"
                                value={tokenReserve}
                                onChange={(e) => setTokenReserve(e.target.value)}
                                className="bg-zinc-900/50 border-zinc-700 text-gray-200"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">ETH Amount</label>
                            <Input
                                type="text"
                                placeholder="ETH Amount"
                                value={ethAmount}
                                onChange={(e) => setEthAmount(e.target.value)}
                                className="bg-zinc-900/50 border-zinc-700 text-gray-200"
                            />
                        </div>

                        <Button
                            onClick={handleCreatePool}
                            disabled={isApproving || isCreatingPool}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {isApproving ? "Approving..." : isCreatingPool ? "Creating Pool..." : "Create Pool"}
                        </Button>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Available Pools</h2>
                    {pools?.map((pool: PoolInfo, index: Key | null | undefined) => (
                        <Card
                            key={index}
                            className="w-full bg-zinc-800/50 backdrop-blur-lg border-zinc-700 hover:border-emerald-500/50 transition-colors"
                        >
                            <CardContent className="p-6 space-y-3">
                                <div className="grid gap-2">
                                    <div>
                                        <span className="text-gray-400">Pool Address:</span>
                                        <p className="text-gray-200 break-all font-mono text-sm">{pool.poolAddress}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                        <div>
                                            <span className="text-gray-400">Token Price:</span>
                                            <p className="text-emerald-400 font-semibold">{formatEther(pool.price)} ETH</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">ETH Reserve:</span>
                                            <p className="text-gray-200">{formatEther(pool.ethReserve)} ETH</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Token Reserve:</span>
                                            <p className="text-gray-200">{formatEther(pool.tokenReserve)} Tokens</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default CreatePool;