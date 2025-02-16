import hre from "hardhat";

async function main() {
    const dexContract = await hre.ethers.getContractFactory("TokenFactory");

    const contract = await dexContract.deploy();

    const contractAddress = await contract.getAddress()

    console.log("Dex contract deployed at address: ", contractAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})