import { ethers } from "hardhat";
import { XmasNFT, XmasTree } from "../typechain-types";

/**
 * 1. Deploy XmasNFT
 * 2. Deploy XMAS (ERC20)
 * 3. Deploy XmasTree
 * 4. XmasNFT.setTreeConfig(tree_address, XMAS_address)
 * 5. XMAS.setTree(tree_address)
 */
export async function deployContracts() {
  const [owner] = await ethers.getSigners();
  const ownerAddr = await owner.getAddress();

  const XmasNFT_F = await ethers.getContractFactory("XmasNFT", owner);
  const XMAS_F = await ethers.getContractFactory("XMAS", owner);
  const XmasTree_F = await ethers.getContractFactory("XmasTree", owner);

  const ProxyAdmin_F = await ethers.getContractFactory("ProxyAdmin");
  const proxyAdmin = await ProxyAdmin_F.deploy(ownerAddr);
  await proxyAdmin.waitForDeployment();

  const XmasNFT_impl = await XmasNFT_F.deploy().then((c) =>
    c.waitForDeployment()
  );

  // XMAS ERC20
  const XMAS = await XMAS_F.deploy(ethers.parseEther("10000")).then((c) =>
    c.waitForDeployment()
  );
  const XMASAddress = await XMAS.getAddress();

  const XmasTree_impl = await XmasTree_F.deploy().then((c) =>
    c.waitForDeployment()
  );

  const TUP_F = await ethers.getContractFactory(
    "TransparentUpgradeableProxy",
    owner
  );

  const XmasNftProxy = await TUP_F.deploy(
    await XmasNFT_impl.getAddress(),
    ownerAddr,
    XmasNFT_F.interface.encodeFunctionData("__XmasNFT_init", [ownerAddr])
  );
  const XmasNftAddr = await XmasNftProxy.getAddress();

  const XmasTreeProxy = await TUP_F.deploy(
    await XmasTree_impl.getAddress(),
    ownerAddr,
    XmasTree_F.interface.encodeFunctionData("__XmasTree_init", [
      ownerAddr,
      XMASAddress,
      XmasNftAddr,
    ])
  );

  const XmasTreeAddr = await XmasTreeProxy.getAddress();

  const XmasNFT = await ethers.getContractAt("XmasNFT", XmasNftAddr);

  const g1 = await XmasNFT.setTreeConfig.estimateGas(XmasTreeAddr, XMASAddress);
  const t1 = await XmasNFT.setTreeConfig(XmasTreeAddr, XMASAddress, {
    // gasLimit: g1 * 5n,
  });
  await t1.wait();

  const g2 = await XMAS.setTree.estimateGas(XmasTreeAddr);
  const t2 = await XMAS.setTree(XmasTreeAddr, 
    // { gasLimit: g2 * 5n }
  );
  await t2.wait();

  return {
    XMAS,
    XmasNFT,
    XmasTree: await ethers.getContractAt("XmasTree", XmasTreeAddr),
  };
}
