// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.24;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// /// @notice ERC20 Token Contract
// contract TestToken is ERC20 {
//     address public owner;

//     constructor(string memory _name, string memory _symbol, address _owner) ERC20(_name, _symbol) {
//         owner = _owner;
//         _mint(_owner, 1000000 * 10 ** decimals()); // Mint tokens to the creator
//     }
// }

// /// @notice Token Factory Contract
// contract TokenFactory {
//     event TokenCreated(address indexed owner, address tokenAddress);

//     /// @dev Stores all deployed token addresses
//     address[] public allTokens;

//     /// @notice Deploys a new TestToken contract
//     function createToken(string memory _name, string memory _symbol) external returns(address) {
//         TestToken newToken = new TestToken(_name, _symbol, msg.sender);
//         allTokens.push(address(newToken));

//         emit TokenCreated(msg.sender, address(newToken));
//         return address(newToken); 
//     }

//     /// @notice Returns all deployed tokens
//     function getAllTokens() external view returns (address[] memory) {
//         return allTokens;
//     }
// }
