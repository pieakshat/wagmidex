import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "0x5f02a9776fb50b2cfc942ae05c655e88aacf72ecafdf0aaf732ff6217b7b34d6",
        "0x489f1822771b0200278e68c88bfc5bfef176a0d4369dea7856cc1efb29c4335d",
        "0x34045c778d6d2dd3f492bf8c9bef1ce9819edac41c3e5255c1990bef337aa5f5",
        "d72b7b085dbc92d0113f9fbfc9af9ba022e8d868dd1c5aa41fc60d864166f33e",
      ],
    },
    baseSepolia: {
      url: process.env.TESTNET_RPC_URL || "https://sepolia.base.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

export default config;
