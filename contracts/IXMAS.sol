
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IXMAS is IERC20 {
    error NotTree(address account);

    function rewardForTree(address to) external;
    function rewardForOrnament(address to, uint units) external;
}
