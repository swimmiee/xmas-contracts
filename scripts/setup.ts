import { ethers } from "hardhat";
import { deployContracts } from "../test/deployContract";
import { registerPrimitives } from "../test/registerPrimitives";

// npx hardhat run scripts/setup.ts
// npx hardhat run scripts/setup.ts --network localhost
// npx hardhat run scripts/setup.ts --network sepolia
// npx hardhat run scripts/setup.ts --network basesep
async function setUp() {
  const [owner] = await ethers.getSigners();

  const res = await deployContracts();
  console.log({
    owner: owner.address,
    tree: await res.XmasTree.getAddress(),
    XMAS: await res.XMAS.getAddress(),
    nft: await res.XmasNFT.getAddress(),
  });

  await registerPrimitives(await res.XmasTree.getAddress());
  console.log({
    owner: owner.address,
    tree: await res.XmasTree.getAddress(),
    XMAS: await res.XMAS.getAddress(),
    nft: await res.XmasNFT.getAddress(),
  });
}

setUp();
