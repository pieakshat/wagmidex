const { ethers } = require("hardhat");

async function main() {
    // Get the TokenFactory contract address (replace with actual deployed address)
    const tokenFactoryAddress = "0x023BBF861569c6C72DCbdB5b8609580023b97141"; // Your TokenFactory address here

    console.log("TokenFactory Address:", tokenFactoryAddress);


    // 1. Get the TokenFactory contract
    const TokenFactory = await ethers.getContractFactory("TokenFactory");
    console.log(TokenFactory);
    const tokenFactory = TokenFactory.attach(tokenFactoryAddress);

    console.log("Interacting with TokenFactory at address:", tokenFactory.address);

    // 2. Optionally, deploy new tokens (uncomment to deploy more tokens)
    // const tx1 = await tokenFactory.createToken("TestToken1", "TT1");
    // await tx1.wait();
    // console.log("Token 1 deployed.");

    // const tx2 = await tokenFactory.createToken("TestToken2", "TT2");
    // await tx2.wait();
    // console.log("Token 2 deployed.");

    // 3. Get all deployed token addresses
    const allTokens = await tokenFactory.allTokens();
    console.log("All deployed tokens:", allTokens);
}

// Run the script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
