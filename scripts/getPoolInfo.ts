import { ethers } from "hardhat";

async function getPoolInfo() {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // deployed contract address
    const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const dexContract = await ethers.getContractAt("Dex", contractAddress);
    // console.log(dexContract);

    console.log("Getting pool info...");
    const poolInfo = await dexContract.getAllPoolsInfo();
    console.log("Pool Info: ", poolInfo);
}

getPoolInfo().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 