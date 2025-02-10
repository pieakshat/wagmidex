import { ethers } from "hardhat";

async function tokenEthSwap() {
    const contractAddress = "0x74A1a4e335D466372f4be2c65A11586f6c4E37cd"; // deployed contract address
    const tokenAddress = "0x69442c9753DC66479E47d9885541D2C346603B15"; // token address
    const tokenAmount = ethers.parseEther("100"); // token Amount
    const minEthOut = ethers.parseEther("0.1"); // minimum tokens out

    const tokenContract = await ethers.getContractAt("TestToken", tokenAddress);

    console.log("Approving tokens...");
    const approveTx = await tokenContract.approve(contractAddress, tokenAmount);
    await approveTx.wait();
    console.log("Tokens approved");

    const dexContract = await ethers.getContractAt("Dex", contractAddress);

    console.log("Swapping tokens for eth...");
    const tx = await dexContract.tokenToEthSwap(
        tokenAddress,
        tokenAmount,
        minEthOut
    );

    const receipt = await tx.wait();
    console.log("Swap successful!");

    const event = receipt?.logs.find(
        (log: any) => log.eventName === "TokenToEthSwap"
    );
    if (event) {
        console.log("ETH received:", ethers.formatEther(event.args.ethOut));
    }


}

tokenEthSwap().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 