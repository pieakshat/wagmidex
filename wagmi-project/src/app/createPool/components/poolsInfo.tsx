import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { useReadContract } from "wagmi";
import DexABI from "../abis/dex.json";
import { DEX_ADDRESS } from "../page";

// const DEX_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function PoolList() {
    const [pools, setPools] = useState<any[]>([]); // Initialize as an array

    const { readContractAsync } = useReadContract();

    useEffect(() => {
        const fetchPools = async () => {
            try {
                const poolsData = await readContractAsync({
                    address: DEX_ADDRESS,
                    abi: DexABI,
                    functionName: "getAllPoolsInfo",
                });
                console.log("Fetched pools:", poolsData);
                setPools(poolsData);
            } catch (error) {
                console.error("Error fetching pools:", error);
            }
        };

        fetchPools();
    }, []);

    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {pools.length > 0 ? (
                pools.map(
                    (pool: { price: bigint; ethReserve: bigint; tokenReserve: bigint }, index: number) => (
                        <div
                            key={index}
                            style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px", width: "200px" }}
                        >
                            <p><strong>Token Price:</strong> {formatEther(pool.price)} ETH</p>
                            <p><strong>ETH Reserve:</strong> {formatEther(pool.ethReserve)}</p>
                            <p><strong>Token Reserve:</strong> {formatEther(pool.tokenReserve)}</p>
                        </div>
                    )
                )
            ) : (
                <p>No pools available</p>
            )}
        </div>
    );
}

export default PoolList;
