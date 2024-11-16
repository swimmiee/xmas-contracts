// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IXmasNFT is IERC721 {
    error NotTree(address account);

    function mint(address to, uint tokenId) external;
}
