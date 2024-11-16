import { expect } from "chai";
import { ethers } from "hardhat";
import { deployContracts } from "./deployContract";
import { XMAS, XmasNFT, XmasTree } from "../typechain-types";
import { registerPrimitives } from "./registerPrimitives";

const { parseEther } = ethers;
describe("XmasTree", () => {
  let xmas: XMAS;
  let nft: XmasNFT;
  let tree: XmasTree;

  before("deploy", async () => {
    const res = await deployContracts();

    xmas = res.XMAS;
    nft = res.XmasNFT;
    tree = res.XmasTree;
  });

  it("Create Tree: No Background: Reverted with No Fee", async () => {
    const [, user1] = await ethers.getSigners();
    expect(tree.connect(user1).createTree(0, { value: 0 })).revertedWith("TF");
  });

  it("Create Tree: No Background: Over Fee", async () => {
    const [, user1] = await ethers.getSigners();
    const value = parseEther("0.002");
    expect(tree.connect(user1).createTree(0, { value })).revertedWith("TF");
  });

  it("Create Tree: No Background", async () => {
    const [, user1] = await ethers.getSigners();
    const value = parseEther("0.001");
    const tx = await tree.connect(user1).createTree(0, { value });
    await tx.wait();
    expect(tx).to.emit(tree, "TreeCreated").withArgs(user1.address, 1);

    const tree1 = await tree.getTree(1);
    expect(tree1.owner).to.eql(user1.address);
    expect(tree1.ornamentCount).to.eql(0n);
    expect(tree1.bgId).to.eql(0n);
    expect(tree1.ornamentIds).to.deep.equals(new Array(12).fill(0n));
    expect(tree1.adorners).to.deep.equals(
      new Array(12).fill(ethers.ZeroAddress)
    );
  });

  it("register ornaments", async () => {
    await registerPrimitives(await tree.getAddress());
  });

  it("Adorn", async () => {
    const [, , user2] = await ethers.getSigners();
    const value = parseEther("0.0005") * 3n;
    await tree.connect(user2).adorn(1, 3, { value });

    const tree1 = await tree.getTree(1);
    expect(tree1.ornamentCount).to.eql(1n);

    const orns = new Array(12).fill(0n);
    orns[0] = 3n;

    const adorners = new Array(12).fill(ethers.ZeroAddress);
    adorners[0] = user2.address;

    expect(tree1.ornamentIds).to.deep.equals(orns);
    expect(tree1.adorners).to.deep.equals(adorners);
  });
});
