"use client"

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import MintTokenAbi from '../../abis/token.json';
import { ALICE_TOKEN_ADDRESS, BOB_TOKEN_ADDRESS } from "../page";
import { Navbar } from "../components/navbar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

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
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-stone-900 to-neutral-900 text-gray-100">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto mb-4 text-center">
                    <span className="text-gray-300">Need some testnet ETH? </span>
                    <a
                        href="https://docs.base.org/docs/tools/network-faucets/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 underline"
                    >
                        Get it here
                    </a>
                </div>

                <Card className="max-w-md mx-auto bg-zinc-800/50 backdrop-blur-lg border-zinc-700">
                    <CardHeader>
                        <CardTitle className="text-2xl text-emerald-400">Mint Tokens</CardTitle>
                        <CardDescription className="text-gray-400">
                            Mint test tokens for trading on DEXchange
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert className="bg-zinc-900/50 border-emerald-800">
                            <InfoIcon className="h-4 w-4 text-emerald-400" />
                            <AlertDescription className="text-gray-300">
                                Select a token to mint. These are test tokens that can be used to interact with the DEX.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Select Token:</label>
                            <Select
                                value={tokenAddress}
                                onValueChange={(value) => setTokenAddress(value as `0x${string}`)}
                            >
                                <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-700 text-gray-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-700">
                                    <SelectItem value={ALICE_TOKEN_ADDRESS} className="text-gray-200 focus:bg-zinc-800 focus:text-emerald-400">
                                        Alice Token
                                    </SelectItem>
                                    <SelectItem value={BOB_TOKEN_ADDRESS} className="text-gray-200 focus:bg-zinc-800 focus:text-emerald-400">
                                        Bob Token
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            onClick={handleMint}
                            disabled={isMinting}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {isMinting ? "Minting..." : "Mint Tokens"}
                        </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default MintToken;