// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenFactory {
    event TokenCreated(address tokenAddress, string name, string symbol, address owner);

    function createToken(string memory name, string memory symbol) external {
        Token newToken = new Token(name, symbol, msg.sender);
        emit TokenCreated(address(newToken), name, symbol, msg.sender);
    }
}

contract Token is ERC20 {
    constructor(string memory name, string memory symbol, address owner) ERC20(name, symbol) {
        _mint(owner, 1000 * 10 ** decimals());
    }
}
