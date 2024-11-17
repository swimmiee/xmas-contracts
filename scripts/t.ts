import { ethers } from "hardhat";

// base sepolia
const contracts = {
  owner: "0x22E4Ee2e606716d9CCB0e987e77b3c9b10c8D45E",
  tree: "0x4cBE57086251b5Af94AF65a045De63e3b2A26396",
  XMAS: "0xDeCA3DcA1F1e75d6c5e8C57aF03B6AaD379229C2",
  nft: "0xdEa7A0550528a163929840c2c810Da4F98933EEE",
};

// polygon mainnet
// const contracts = {
//   owner: '0x22E4Ee2e606716d9CCB0e987e77b3c9b10c8D45E',
//   tree: '0xeD308f47A6246E90BE419b318F46aB32b31182Da',
//   XMAS: '0xe8FFD02481D94E01d65DbF0887180637186944A5',
//   nft: '0x77DA77d38d9263fC0b0830b2BBd46f8f18674d95'
// }
async function T() {
  const t = await ethers.getContractAt("XmasTree", contracts.tree);
  const res = await t.getTree(0);
  console.log(res);
  const tId = await t.nextTreeId();
  console.log(tId);
}

// npx hardhat run scripts/t.ts --network sepolia
// npx hardhat run scripts/t.ts --network basesep
T();
