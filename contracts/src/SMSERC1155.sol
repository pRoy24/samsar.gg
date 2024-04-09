// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ExponentialCurveToken is ERC1155, Ownable, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public totalSupply = 0;
    mapping(address => bool) public hasMinted;
    uint256 private constant DEV_MINT_LIMIT = MAX_SUPPLY / 20; // 5% of total
    uint256 private devMintedAmount = 0;

    // The admin wallet where the profits from the bonding curve difference are sent
    address payable public adminWallet;

    // Events
    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);

    constructor(address payable _adminWallet) ERC1155("TokenURI") {
        require(_adminWallet != address(0), "Invalid admin wallet address");
        adminWallet = _adminWallet;
    }

    // Mint function with bonding curve logic
    function mint(uint256 id) external payable nonReentrant {
        require(totalSupply < MAX_SUPPLY, "Max supply reached");
        require(!hasMinted[msg.sender] || msg.sender == owner(), "Already minted or not owner");
        uint256 mintPrice = calculateMintPrice();

        require(msg.value >= mintPrice, "Insufficient ETH sent");

        if (msg.sender == owner() && devMintedAmount < DEV_MINT_LIMIT) {
            devMintedAmount += 1; // Dev can mint up to 5% of total supply without restrictions
        } else {
            require(totalSupply + 1 <= MAX_SUPPLY, "Exceeds max supply");
            hasMinted[msg.sender] = true; // Mark that the address has minted
        }

        totalSupply += 1;
        _mint(msg.sender, id, 1, "");
        emit Mint(msg.sender, 1);

        // Transfer excess ETH back to the sender if they sent more than the price
        if (msg.value > mintPrice) {
            payable(msg.sender).transfer(msg.value - mintPrice);
        }
    }

    // Burn function with bonding curve logic
    function burn(uint256 id) external nonReentrant {
        require(balanceOf(msg.sender, id) > 0, "No tokens to burn");

        uint256 burnPrice = calculateBurnPrice();

        totalSupply -= 1;
        _burn(msg.sender, id, 1);
        emit Burn(msg.sender, 1);

        payable(msg.sender).transfer(burnPrice);
        // Send the difference to the admin wallet
        uint256 profit = calculateMintPrice() - burnPrice;
        adminWallet.transfer(profit);
    }

    // Placeholder for actual mint price calculation based on an exponential bonding curve
    function calculateMintPrice() public view returns (uint256) {
        // Implement the bonding curve formula here
        // This is a simplified placeholder
        return 0.01 ether + (0.01 ether * totalSupply / 1000);
    }

    // Placeholder for actual burn price calculation, 2% lower than the mint price
    function calculateBurnPrice() public view returns (uint256) {
        return calculateMintPrice() * 98 / 100;
    }
}
