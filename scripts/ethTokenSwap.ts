import { ethers } from "hardhat";

async function ethTokenSwap() {
    const contractAddress = "0x74A1a4e335D466372f4be2c65A11586f6c4E37cd"; // deployed contract address
    const tokenAddress = "0x69442c9753DC66479E47d9885541D2C346603B15"; // token address
    const ethAmount = ethers.parseEther("3"); // eth amount
    const minTokensOut = ethers.parseEther("0.1"); // minimum tokens out

    const dexContract = await ethers.getContractAt("Dex", contractAddress);

    console.log("Swapping eth for tokens...");
    const tx = await dexContract.ethToTokenSwap(
        tokenAddress,
        minTokensOut,
        { value: ethAmount }
    );
    const reciept = await tx.wait();
    console.log("Swap succesful");

    const event = reciept?.logs.find((log: any) => {
        log.eventNeeded === "EthToTokenSwap";
    });
    if (event) {
        console.log("Tokens received:", ethers.formatEther(event.args.tokensOut));
    }
}

ethTokenSwap().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 