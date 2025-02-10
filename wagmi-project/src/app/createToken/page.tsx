"use client";
import { useState } from "react";
import { useAccount, useWriteContract, useWatchContractEvent } from "wagmi";
import TokenFactoryABI from "../../abis/TokenFactory.json";

const TOKEN_FACTORY_ADDRESS = "0x023BBF861569c6C72DCbdB5b8609580023b97141";

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
        abi: TokenFactoryABI,
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

        try {
            setError(null);
            // Call the contract to deploy the token
            const tx = await writeContractAsync({
                address: TOKEN_FACTORY_ADDRESS,
                abi: TokenFactoryABI,
                functionName: "createToken",
                args: [tokenName, tokenSymbol],
            });

            // Get the transaction hash
            setTxHash(tx);



            // Set the deployed token address in the state
            //setDeployedTokenAddress(tokenAddress);
        } catch (err) {
            console.error("Deployment error:", err);
            setError("Failed to deploy token.");
        }
    }

    return (
        <div>
            <h1>Create Your Own Token</h1>
            {isConnected ? (
                <>
                    <input
                        type="text"
                        placeholder="Token Name"
                        value={tokenName}
                        onChange={(e) => setTokenName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Token Symbol"
                        value={tokenSymbol}
                        onChange={(e) => setTokenSymbol(e.target.value)}
                    />
                    <button onClick={deployToken} disabled={isPending}>
                        {isPending ? "Deploying..." : "Deploy Token"}
                    </button>
                    {txHash && !deployedTokenAddress && (
                        <p>
                            Transaction pending:{" "}
                            <a
                                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {txHash}
                            </a>
                        </p>
                    )}
                    {deployedTokenAddress && (
                        <p>
                            Token deployed at:{" "}
                            <a
                                href={`https://sepolia.etherscan.io/address/${deployedTokenAddress}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {deployedTokenAddress}
                            </a>
                        </p>
                    )}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </>
            ) : (
                <p>Please connect your wallet.</p>
            )}
        </div>
    );
}

export default CreateToken;
