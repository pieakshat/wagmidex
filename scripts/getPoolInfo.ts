import { ethers } from "hardhat";

async function getPoolInfo() {
    const contractAddress = "0x80504fb095c623f0d33FE246c9D5f0c7Df6f1807"; // deployed contract address
    const tokenAddress = "0x501d826490c6E34Abf4cde1Ac6E1091FdA8A8Cce";
    const dexContract = await ethers.getContractAt("Dex", contractAddress);
    // console.log(dexContract);

    console.log("Getting pool info...");
    const poolInfo = await dexContract.getAllPoolsInfo();
    console.log("Pool Info: ", poolInfo);
}

getPoolInfo().catch((error) => {
    console.error(error); s
    process.exitCode = 1;
}); 