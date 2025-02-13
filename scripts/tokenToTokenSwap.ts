import { ethers } from "hardhat";

async function tokenToTokenSwap() {
    const contractAddress = "0x7359ea4f7945F31944670746DF3369Da500D0733"; // deployed contract address
    const token1Address = "0xaF79D44FC4196B7879829f1cF9867E9569b2A5e2"; // token address
    const token2Address = "0x082624a2345d8dc4B91d3F23bdd7c1bf06f7268B"; // token address

    const token1Contract = await ethers.getContractAt("TestToken", token1Address);
    const token2Contract = await ethers.getContractAt("TestToken", token2Address);

    const token1Amount = ethers.parseEther("100"); // token amount
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