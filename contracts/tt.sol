// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TT is ERC20 {
    address public owner;

    constructor() ERC20("Alice", "ALC") {
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Mint tokens to the creator
        _mint(address(0x9D0616E0DA062907A0E64c44bD09d0A3DD2e3408), 1000000 * 10 ** decimals()); 
    }

    function mintTokens() public {
        _mint(msg.sender, 1000);
    }
}