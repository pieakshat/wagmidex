import hre from "hardhat";

async function main() {

    const accounts = await hre.ethers.getSigners(); // Get all available signers
    const secondAccount = accounts[1]; // Select the second account

    console.log("Deploying contract using account:", await secondAccount.getAddress());

    const tokenContract = await hre.ethers.getContractFactory("TestToken", secondAccount);

    const contract = await tokenContract.deploy();

    const contractAddress = await contract.getAddress()
    console.log("contract deployed at address: ", contractAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})