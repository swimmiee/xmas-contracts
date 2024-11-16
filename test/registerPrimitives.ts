import { ethers } from "hardhat";

export async function registerPrimitives(treeAddr: string) {
  const [owner] = await ethers.getSigners();
  const ownerAddr = await owner.getAddress();

  const tree = await ethers.getContractAt("XmasTree", treeAddr, owner);

  const orns = new Array(18).fill(0).map((_, i) => ({
    owner: owner.address,
    priceUnit: 1 + (i % 3),
    name: "O" + i,
    uri: i + ".png",
  }));
  const g1 = await tree.registerOrnaments.estimateGas(orns);
  const t = await tree.registerOrnaments(orns, { gasLimit: g1 * 3n });
  await t.wait();

  const bgs = [
    { priceUnit: 1, uri: "1.png" },
    { priceUnit: 1, uri: "2.png" },
    { priceUnit: 1, uri: "3.png" },
    { priceUnit: 1, uri: "4.png" },
  ];

  const g2 = await tree.registerBackground.estimateGas(bgs);
  const t2 = await tree.registerBackground(bgs, { gasLimit: g2 * 3n });
  await t2.wait();
}
