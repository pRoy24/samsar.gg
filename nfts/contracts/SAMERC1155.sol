// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SAMERC1155 is Ownable, ERC1155URIStorage, ReentrancyGuard {
    address private _owner;
    string private _baseURI = "";

    uint256 public constant MAX_SUPPLY = 10000;
    mapping(uint256 => uint256) public totalSupply;
    mapping(uint256 => uint256) public effectiveSupply;
    

    mapping(uint256 => uint256) public currentMintPrice;


    address public adminWallet;
    uint256 private constant FEE_RATE = 50; 
    uint256 private constant BASE_PRICE = 0.000001 ether;
    uint256 private constant PRICE_FACTOR = 105000;

    mapping(uint256 => bool) public creatorMinted;

    uint256 public nextTokenId = 0;


    constructor(
        address initialOwner,
        address _adminWallet
    ) Ownable(initialOwner) ERC1155(_baseURI) {
        transferOwnership(initialOwner);
        adminWallet = _adminWallet;
    }

    // Override the _safeTransferFrom function to disable transfers
    function safeTransferFrom(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual override {
        require(false, "Transfers are disabled");
    }

    // Override the _safeBatchTransferFrom function to disable batch transfers
    function safeBatchTransferFrom(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual override {
        require(false, "Batch transfers are disabled");
    }

    function mint(uint256 tokenId) public payable nonReentrant {
        uint256 amount = 1;
        require(creatorMinted[tokenId], "Creator mint must occur first.");
        uint256 price = calculatePrice(effectiveSupply[tokenId], amount);
        require(msg.value >= price, "Insufficient funds for minting");

        if (totalSupply[tokenId] + amount > MAX_SUPPLY) {
            revert("Total supply exceeds the maximum supply");
        }

        totalSupply[tokenId] += amount;
        effectiveSupply[tokenId] += amount;

        currentMintPrice[tokenId] = calculatePrice(effectiveSupply[tokenId], 1);

        _mint(msg.sender, tokenId, amount, "");
  

        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }

    function mintCreator(
        uint256 tokenId,
        uint256 amount,
        address minter
    ) public nonReentrant {
        require(
            msg.sender == adminWallet,
            "Only admin can initiate creator mint."
        );
        require(!creatorMinted[tokenId], "Creator mint can only be done once.");
        require(
            amount <= (MAX_SUPPLY * 5) / 100,
            "Amount exceeds 5% of the total supply."
        );

        totalSupply[tokenId] += amount;
        // currentMintPrice[tokenId] = calculatePrice(totalSupply[tokenId], 1);

        _mint(minter, tokenId, amount, "");
        
        creatorMinted[tokenId] = true;
    }

    function calculatePrice(
        uint256 _totalSupply,
        uint256 amount
    ) public pure returns (uint256) {
        uint256 price = 0;
        for (uint256 i = 0; i < amount; i++) {
            price += BASE_PRICE * (PRICE_FACTOR ** (_totalSupply + i) / 100000); // Adjust the exponentiation and division properly
        }
        return price;
    }

    // Burn function with full mint price and admin fee
    function burn(uint256 tokenId, uint256 amount) public nonReentrant {
        require(
            balanceOf(msg.sender, tokenId) >= amount,
            "Insufficient balance for burning"
        );

        uint256 burnPrice = calculatePrice(effectiveSupply[tokenId], amount);
        uint256 adminFee = (burnPrice * FEE_RATE) / 10000;

        totalSupply[tokenId] -= amount;
        effectiveSupply[tokenId] -= amount;
        _burn(msg.sender, tokenId, amount);

        payable(msg.sender).transfer(burnPrice - adminFee);
        payable(adminWallet).transfer(adminFee);
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseURI = baseURI;
    }

    function setURI(uint256 tokenId, string memory _tokenURI) public onlyOwner {
        _setURI(tokenId, _tokenURI);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(_baseURI, super.uri(tokenId)));
    }

    function getNextTokenId() public view returns (uint256) {
        return nextTokenId;
    }

    function setNextTokenURI(string memory _tokenURI) public onlyOwner {
        _setURI(nextTokenId, _tokenURI);
        nextTokenId++;
    }





}
