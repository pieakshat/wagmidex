import { ethers } from "hardhat";
import hre from "hardhat";

async function createPool() {
    const contractAddress = "0x74A1a4e335D466372f4be2c65A11586f6c4E37cd"; // Deployed contract address
    const tokenAddress = "0xBAA46A8693D546aaBb44B640D8eaa84D863aD508"; // Token address
    const tokenReserve = ethers.parseEther("1000"); // Token reserve
    const ethAmount = ethers.parseEther("1"); // ETH amount

    const accounts = await hre.ethers.getSigners(); // Get all available signers
    const secondAccount = accounts[1]; // Select the second account

    console.log("Using account for deployment:", await secondAccount.getAddress());

    // Connect the second account to the token contract
    const tokenContract = await ethers.getContractAt("TestToken", tokenAddress, secondAccount);

    // Approve DEX contract to use the tokens
    console.log("Approving tokens...");
    const approveTx = await tokenContract.approve(contractAddress, ethers.parseEther("100000000000"));
    await approveTx.wait();
    console.log("Tokens approved");

    // Connect the second account to the DEX contract
    const dexContract = await ethers.getContractAt("Dex", contractAddress, secondAccount);

    // Create the pool
    console.log("Creating pool...");
    const tx = await dexContract.createPool(
        tokenAddress,
        tokenReserve,
        { value: ethAmount }
    );
    await tx.wait();
    console.log("Pool created successfully!");
}

createPool().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});