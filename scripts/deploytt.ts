import { error } from "console";
import hre from "hardhat";
// script to deploy test tokens

async function main() {
    const ttContract = await hre.ethers.getContractFactory("TT");

    const contract = await ttContract.deploy();

    const address = await contract.getAddress();

    console.log("tt contract deployed at address: ", address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})