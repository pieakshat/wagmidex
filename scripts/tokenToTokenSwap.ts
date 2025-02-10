import { ethers } from "hardhat";

async function tokenToTokenSwap() {
    const contractAddress = "0x74A1a4e335D466372f4be2c65A11586f6c4E37cd"; // deployed contract address
    const token1Address = "0x69442c9753DC66479E47d9885541D2C346603B15"; // token address
    const token2Address = "0xBAA46A8693D546aaBb44B640D8eaa84D863aD508"; // token address

    const token1Contract = await ethers.getContractAt("TestToken", token1Address);
    const token2Contract = await ethers.getContractAt("TestToken", token2Address);

    const token1Amount = ethers.parseEther("400"); // token amount
    const minToken2Out = ethers.parseEther("0.1"); // minimum tokens out

    console.log("Approving tokens...");
    const approveTx = await token1Contract.approve(contractAddress, token1Amount);
    await approveTx.wait();
    console.log("Tokens approved");

    const dexContract = await ethers.getContractAt("Dex", contractAddress);

    console.log("Swapping tokens for tokens...");
    const tx = await dexContract.tokenToTokenSwap(
        token1Address,
        token2Address,
        token1Amount,
        minToken2Out
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

tokenToTokenSwap().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 