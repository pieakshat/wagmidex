import hre, { ethers } from "hardhat";

async function main() {
    const accounts = await hre.ethers.getSigners(); // Get all available signers
    const sender = accounts[1]; // Select the second account
    const receiver = "0x9D0616E0DA062907A0E64c44bD09d0A3DD2e3408";
    const amount = ethers.parseEther("50");

    console.log(`Sending ${ethers.formatEther(amount)} ETH from ${sender.address} to ${receiver}...`);

    const tx = await sender.sendTransaction({
        to: receiver,
        value: amount,
    });

    console.log(`Transaction sent! Hash: ${tx.hash}`);

    // Wait for the transaction to be confirmed
    await tx.wait();
    console.log("Transaction confirmed!");
}

main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});