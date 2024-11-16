// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IXmasNFT} from "./IXmasNFT.sol";
import {IXmasTree} from "./IXmasTree.sol";
import {IXMAS} from "./IXMAS.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

/**
 * @title XMAS Tree
 * @author Danny
 * @notice Deploy order:
 * 1. Deploy XmasNFT
 * 2. Deploy XMAS (ERC20)
 * 3. Deploy XmasTree
 * 4. XmasNFT.setTreeConfig(tree_address, XMAS_address)
 * 5. XMAS.setTree(tree_address)
 */
contract XmasTree is IXmasTree, OwnableUpgradeable {
    uint constant TREE_CREATION_FEE = 0.001 ether;
    uint constant ORNAMENT_REGISTER_FEE = 0.005 ether;
    uint constant ORNAMENT_BASE_PRICE = 0.0005 ether;
    uint constant BACKGROUND_BASE_PRICE = 100 ether;

    Tree[] private trees;
    Background[] private backgrounds;
    Ornament[] private ornaments;

    IXMAS public XMAS;
    IXmasNFT public XmasNFT;

    mapping(address => uint[]) public ownedTrees;
    mapping(uint => mapping(address => bool)) public userAdorned;

    function __XmasTree_init(
        address owner_,
        address XMAS_,
        address XmasNFT_
    ) public initializer {
        __Ownable_init(owner_);

        uint32[12] memory defaultIds;
        address[12] memory defaultAdorners;

        XMAS = IXMAS(XMAS_);
        XmasNFT = IXmasNFT(XmasNFT_);

        trees.push(Tree(address(0), 0, 0, defaultIds, defaultAdorners, false));
        backgrounds.push(Background(0, ""));
        ornaments.push(Ornament(address(0), 0, "NULL", "NULL"));
    }

    function getTree(uint treeId) public view returns (Tree memory tree) {
        tree = trees[treeId];
    }

    function nextTreeId() public view returns (uint) {
        return trees.length;
    }

    /**
     * set background 0 for default bg
     */
    function createTree(uint32 bgId) external payable override {
        require(msg.value == TREE_CREATION_FEE, "TF");

        // Background memory bg = backgrounds[bgId];
        // if (bg.priceUnit > 0) {
        //     SafeERC20.safeTransferFrom(
        //         XMAS,
        //         msg.sender,
        //         address(this),
        //         bg.priceUnit * BACKGROUND_BASE_PRICE
        //     );
        // }

        uint32[12] memory defaultIds;
        address[12] memory defaultAdorners;
        uint treeId = trees.length;
        trees.push(
            Tree(msg.sender, 0, bgId, defaultIds, defaultAdorners, false)
        );
        emit TreeCreated(msg.sender, treeId);
    }

    function adorn(uint treeId, uint ornamentId) external payable override {
        require(treeId > 0, "T0");
        require(ornamentId > 0, "O0");
        Tree memory tree = trees[treeId];
        Ornament memory o = ornaments[ornamentId];

        uint price = o.priceUnit * ORNAMENT_BASE_PRICE;
        require(price == msg.value, "VAL");
        // require(!userAdorned[treeId][msg.sender], "ADO");

        uint position = tree.ornamentCount;

        userAdorned[treeId][msg.sender] = true;
        trees[treeId].ornamentIds[position] = uint32(ornamentId);
        trees[treeId].adorners[position] = msg.sender;
        trees[treeId].ornamentCount += 1;

        XMAS.rewardForOrnament(msg.sender, o.priceUnit);

        emit Adorn(
            msg.sender,
            treeId,
            ornamentId,
            position,
            tree.ornamentCount + 1
        );
    }

    function registerBackground(Background[] calldata bgs) external onlyOwner {
        for (uint i = 0; i < bgs.length; i++) {
            backgrounds.push(bgs[i]);
        }
    }

    function registerOrnaments(Ornament[] calldata os) external onlyOwner {
        for (uint i = 0; i < os.length; i++) {
            _registerOrnament(os[i]);
        }
    }

    function registerOrnament(
        string calldata name,
        string calldata uri
    ) external payable {
        require(msg.value == ORNAMENT_REGISTER_FEE, "ORF");
        _registerOrnament(Ornament(msg.sender, 1, name, uri));
    }

    function _registerOrnament(Ornament memory o) private {
        ornaments.push(o);
    }

    function mint(uint treeId) external override {
        Tree memory tree = trees[treeId];
        require(tree.owner == msg.sender, "!O");

        XMAS.rewardForTree(msg.sender);
        XmasNFT.mint(msg.sender, treeId);
    }
}
