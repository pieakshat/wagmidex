"use client";
import { useState } from "react";
import { useAccount, useWriteContract, useWatchContractEvent } from "wagmi";
import tokenFactoryABI from "../../abis/tokenFactory.json"
import { Navbar } from "../components/navbar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, ExternalLink } from "lucide-react";

const TOKEN_FACTORY_ADDRESS = "0xc0e2D540523BA2D02dFcce0b5E8A40428BbAd9C1";

function CreateToken() {
    const { address, isConnected } = useAccount();
    const { writeContractAsync, isPending } = useWriteContract();
    const [tokenName, setTokenName] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");
    const [txHash, setTxHash] = useState<string | null>(null);
    const [deployedTokenAddress, setDeployedTokenAddress] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useWatchContractEvent({
        address: TOKEN_FACTORY_ADDRESS,
        abi: tokenFactoryABI,
        eventName: "TokenCreated",
        onLogs(logs) {
            console.log('new logs!', logs)
            //setDeployedTokenAddress(logs[0]); 
        },
    });

    async function deployToken() {
        if (!isConnected) {
            setError("Please connect your wallet.");
            return;
        }
        if (!tokenName || !tokenSymbol) {
            setError("Token name and symbol are required.");
            return;
        }
        console.log(tokenFactoryABI);

        try {
            setError(null);
            const tx = await writeContractAsync({
                address: TOKEN_FACTORY_ADDRESS,
                abi: tokenFactoryABI,
                functionName: "createToken",
                args: [tokenName, tokenSymbol],
            });

            setTxHash(tx);
        } catch (err) {
            console.error("Deployment error:", err);
            setError("Failed to deploy token.");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-stone-900 to-neutral-900 text-gray-100">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <Card className="max-w-md mx-auto bg-zinc-800/50 backdrop-blur-lg border-zinc-700">
                    <CardHeader>
                        <CardTitle className="text-2xl text-emerald-400">Create Token</CardTitle>
                        <CardDescription className="text-gray-400">
                            Deploy your own ERC20 token on the network
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert className="bg-zinc-900/50 border-emerald-800">
                            <InfoIcon className="h-4 w-4 text-emerald-400" />
                            <AlertDescription className="text-gray-300">
                                Create your custom token by entering a name and symbol. Make sure you have enough ETH for deployment.
                            </AlertDescription>
                        </Alert>

                        {isConnected ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-300">Token Name:</label>
                                    <Input
                                        type="text"
                                        placeholder="e.g. My Custom Token"
                                        value={tokenName}
                                        onChange={(e) => setTokenName(e.target.value)}
                                        className="bg-zinc-900/50 border-zinc-700 text-gray-200 placeholder:text-gray-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-300">Token Symbol:</label>
                                    <Input
                                        type="text"
                                        placeholder="e.g. MCT"
                                        value={tokenSymbol}
                                        onChange={(e) => setTokenSymbol(e.target.value)}
                                        className="bg-zinc-900/50 border-zinc-700 text-gray-200 placeholder:text-gray-500"
                                    />
                                </div>

                                <Button
                                    onClick={deployToken}
                                    disabled={isPending}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                    {isPending ? "Deploying..." : "Deploy Token"}
                                </Button>

                                {txHash && !deployedTokenAddress && (
                                    <Alert className="bg-zinc-900/50 border-emerald-800">
                                        <AlertDescription className="text-gray-300 flex items-center gap-2">
                                            Transaction pending:{" "}
                                            <a
                                                href={`https://base-sepolia.blockscout.com/tx/${txHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                                            >
                                                View on Etherscan
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {deployedTokenAddress && (
                                    <Alert className="bg-zinc-900/50 border-emerald-800">
                                        <AlertDescription className="text-gray-300 flex items-center gap-2">
                                            Token deployed at:{" "}
                                            <a
                                                href={`https://base-sepolia.blockscout.com/tx/${deployedTokenAddress}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                                            >
                                                View on Etherscan
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {error && (
                                    <Alert className="bg-red-900/50 border-red-800">
                                        <AlertDescription className="text-red-200">
                                            {error}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        ) : (
                            <Alert className="bg-zinc-900/50 border-zinc-700">
                                <AlertDescription className="text-gray-300">
                                    Please connect your wallet to create a token.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

export default CreateToken;