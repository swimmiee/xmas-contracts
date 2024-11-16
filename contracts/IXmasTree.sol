// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

interface IXmasTree {
    struct Tree {
        address owner;
        uint8 ornamentCount;
        uint32 bgId;
        uint32[12] ornamentIds;
        address[12] adorners;
        bool minted;
    }

    struct Background {
        uint priceUnit;
        string uri;
    }

    struct Ornament {
        address owner;
        uint priceUnit;
        string name;
        string uri;
    }

    event TreeCreated(address indexed owner, uint indexed treeId);
    event Adorn(
        address indexed user,
        uint indexed treeId,
        uint ornamentId,
        uint position,
        uint8 ornamentCount
    );

    function createTree(uint32 bgId) external payable;
    function adorn(uint treeId, uint ornamentId) external payable;

    function mint(uint treeId) external;
}
