import hre from "hardhat";

async function main() {
    const dexContract = await hre.ethers.getContractFactory("Dex");

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})