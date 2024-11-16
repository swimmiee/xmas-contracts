import { ethers } from "hardhat";

const contracts = {
  owner: "0x22E4Ee2e606716d9CCB0e987e77b3c9b10c8D45E",
  tree: "0x4cBE57086251b5Af94AF65a045De63e3b2A26396",
  XMAS: "0xDeCA3DcA1F1e75d6c5e8C57aF03B6AaD379229C2",
  nft: "0xdEa7A0550528a163929840c2c810Da4F98933EEE",
};
// const contracts = {
//   owner: "0x22E4Ee2e606716d9CCB0e987e77b3c9b10c8D45E",
//   tree: "0x55dED5A23cB56B6A80763Dd1BB0C78C61432410D",
//   XMAS: "0x3b8D09BB63a69aB4863BFA31F7A7FaA64d04913f",
//   nft: "0xAa89D4E4762563FA5C99B1af4C2e2Dd5cF007E59",
// };
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
