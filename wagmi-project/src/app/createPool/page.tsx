"use client";
import { Key, useEffect, useState } from "react";
import { parseEther, formatEther } from "viem";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import TokenABI from "../../abis/token.json";
import DexABI from "../../abis/dex.json";
import { DEX_ADDRESS } from "../page";

// export const DEX_ADDRESS = "0x7359ea4f7945F31944670746DF3369Da500D0733";

interface PoolInfo {
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
            select: (data) => data as PoolInfo[], // Cast the data to PoolInfo[]
        },
    });
    const [tokenAddress, setTokenAddress] = useState<`0x${string}`>("0x");
    const [tokenReserve, setTokenReserve] = useState("");
    const [ethAmount, setEthAmount] = useState("");
    const [isApproving, setIsApproving] = useState(false);
    const [isCreatingPool, setIsCreatingPool] = useState(false);

    useEffect(() => {
        console.log("data: ", pools);
    }, [pools])

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
            //await useWaitForTransaction({ hash: approveTx.hash });
            setIsApproving(false);

            setIsCreatingPool(true);
            const createPoolTx = await writeContractAsync({
                address: DEX_ADDRESS,
                abi: DexABI,
                functionName: "createPool",
                args: [tokenAddress, parseEther(tokenReserve)],
                value: parseEther(ethAmount),
            });
            //await useWaitForTransaction({ hash: createPoolTx.hash });
            setIsCreatingPool(false);

            alert("Pool created successfully!");
            refetch(); // refresh after creation
        } catch (error) {
            console.error("Error creating pool:", error);
            setIsApproving(false);
            setIsCreatingPool(false);
            alert("Transaction failed");
        }
    };

    return (
        <div>
            <h2>Create Pool</h2>
            <input
                type="text"
                placeholder="Token Address"
                value={tokenAddress}
                onChange={(e) => {
                    let value = e.target.value;
                    if (value.startsWith("0x")) {
                        setTokenAddress(value as `0x${string}`);
                    }
                }}
            />

            <input type="text" placeholder="Token Reserve" value={tokenReserve} onChange={(e) => setTokenReserve(e.target.value)} />
            <input type="text" placeholder="ETH Amount" value={ethAmount} onChange={(e) => setEthAmount(e.target.value)} />
            <button onClick={handleCreatePool} disabled={isApproving || isCreatingPool}>
                {isApproving ? "Approving..." : isCreatingPool ? "Creating Pool..." : "Create Pool"}
            </button>

            <h2>Available Pools</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {pools?.map((pool: { poolAddress: string; price: bigint; ethReserve: bigint; tokenReserve: bigint; }, index: Key | null | undefined) => (
                    <div key={index} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px", width: "200px" }}>
                        <p><strong>pool address:</strong> {pool.poolAddress}</p>
                        <p><strong>Token Price:</strong> {formatEther(pool.price)} ETH</p>
                        <p><strong>ETH Reserve:</strong> {formatEther(pool.ethReserve)}</p>
                        <p><strong>Token Reserve:</strong> {formatEther(pool.tokenReserve)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CreatePool;
