import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";
import { configDotenv } from "dotenv";

configDotenv();

// 0x22E4Ee2e606716d9CCB0e987e77b3c9b10c8D45E
const pk1 = process.env.PK1!;
const pk2 = process.env.PK2!;

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    hardhat: {
      blockGasLimit: 300000000
    },
    sepolia: {
      url: "https://1rpc.io/sepolia",
      accounts: [pk1, pk2],
    },
    basesep: {
      url: "https://sepolia.base.org",
      accounts: [pk1, pk2],
    },
  },
};

export default config;
