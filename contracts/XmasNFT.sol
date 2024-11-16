// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {IXmasTree} from "./IXmasTree.sol";
import {IXmasNFT} from "./IXmasNFT.sol";
import {IXMAS} from "./IXMAS.sol";

contract XmasNFT is IXmasNFT, ERC721Upgradeable, OwnableUpgradeable {
    IXmasTree public tree;
    IXMAS public XMAS;
    string public baseTokenURI;

    modifier onlyTree() {
        if (address(tree) != _msgSender()) revert NotTree(_msgSender());
        _;
    }

    function __XmasNFT_init(address owner_) public initializer {
        __Ownable_init(owner_);
        __ERC721_init("X-MAS", "XMAS");
    }

    /**
     *
     * Should run this function after deploying XmasTree contract.
     */
    function setTreeConfig(IXmasTree tree_, IXMAS XMAS_) external onlyOwner {
        tree = tree_;
        XMAS = XMAS_;
    }

    function mint(address to, uint tokenId) external override onlyTree {
        _mint(to, tokenId);
    }

    function setBaseURI(string calldata newBaseURI_) external onlyOwner {
        baseTokenURI = newBaseURI_;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }
}
