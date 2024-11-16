// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IXmasTree} from "./IXmasTree.sol";
import {IXMAS} from "./IXMAS.sol";

// contract XMAS is ERC20Permit("X-MAS", "XMAS") {
contract XMAS is IXMAS, ERC20, Ownable {
    address public tree;
    uint256 public cap;
    uint256 public treeReward;
    uint256 public ornamentRewardPerUnit;

    constructor(
        uint initialCap
    ) ERC20("X-MAS", "XMAS") Ownable(msg.sender) {
        cap = initialCap;
    }

    modifier onlyTree() {
        if (address(tree) != _msgSender()) revert NotTree(_msgSender());
        _;
    }

    function setCap(uint cap_) external onlyOwner {
        if (totalSupply() > cap_) revert();
        cap = cap_;
    }

    function setTree(address tree_) external onlyOwner {
        tree = tree_;
    }

    function rewardForTree(address to) external override onlyTree {
        _mint(to, treeReward);
    }

    function rewardForOrnament(
        address to,
        uint units
    ) external override onlyTree {
        _mint(to, units * ornamentRewardPerUnit);
    }
}
