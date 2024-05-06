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
    uint256 private constant FINAL_PRICE = 1e18; // Final price at max supply
    mapping(uint256 => uint256) public totalSupply; // Effective supply + creator mint amount

    mapping(uint256 => uint256) public currentMintPrice;
    mapping(uint256 => uint256) public creatorMintAmount; // Tracks reserved creator mint amounts for each tokenId
    mapping(uint256 => uint256) public tokenEthBalances;

    address public adminWallet;
    uint256 private constant FEE_RATE = 50; // 0.05% admin fee rate

    mapping(uint256 => bool) public creatorMinted;
    uint256 public nextTokenId = 0;

    constructor(
        address initialOwner,
        address _adminWallet
    ) Ownable(initialOwner) ERC1155(_baseURI) {
        transferOwnership(initialOwner);
        adminWallet = _adminWallet;
    }

    function safeTransferFrom(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual override {
        require(false, "Transfers are disabled");
    }

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
        require(creatorMinted[tokenId], "Creator mint required first");
        require(balanceOf(msg.sender, tokenId) == 0, "Token already minted");
        uint256 _newSupply = totalSupply[tokenId] + 1;
        uint256 price = calculatePrice(tokenId, _newSupply);
        require(msg.value >= price, "Insufficient funds");
        require(_newSupply <= MAX_SUPPLY, "Max supply exceeded");

        totalSupply[tokenId]++;
        _mint(msg.sender, tokenId, 1, "");
        currentMintPrice[tokenId] = calculatePrice(tokenId, totalSupply[tokenId] + 1);

        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
        tokenEthBalances[tokenId] += msg.value;
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
        require(totalSupply[tokenId] + amount <= MAX_SUPPLY, "Max supply exceeded");
        require(amount <= 500, "Creator mint amount too high");
        totalSupply[tokenId] += amount;
        creatorMintAmount[tokenId] = amount;
        _mint(minter, tokenId, amount, "");
        creatorMinted[tokenId] = true;
        currentMintPrice[tokenId] = calculatePrice(tokenId, totalSupply[tokenId] + 1);
    }

    function burnCreator(
        uint256 tokenId,
        uint256 amount,
        address minter,
        uint256 returnAmount,
        uint256 adminFee
    ) public nonReentrant {
        require(
            msg.sender == adminWallet,
            "Only admin can initiate creator burn."
        );
        require(creatorMinted[tokenId], "Creator mint required first");
        require(
            balanceOf(minter, tokenId) >= amount,
            "Insufficient balance for burning"
        );
        require(
            creatorMintAmount[tokenId] >= amount,
            "Insufficient creator mint balance"
        );
        require(
            tokenEthBalances[tokenId] >= returnAmount + adminFee,
            "Insufficient ETH balance for refund"
        );
        
        totalSupply[tokenId] -= amount;
        _burn(minter, tokenId, amount);
        currentMintPrice[tokenId] = calculatePrice(tokenId, totalSupply[tokenId] + 1);

        uint256 totalReturnAmount = returnAmount + adminFee;

        if (totalReturnAmount > 0) {
            tokenEthBalances[tokenId] -= totalReturnAmount;
            payable(minter).transfer(returnAmount);
            payable(adminWallet).transfer(adminFee);
        }
    }

    function calculatePrice(
        uint256 tokenId,
        uint256 _totalSupply
    ) internal view returns (uint256) {
        uint256 creatorMint = creatorMintAmount[tokenId];
        if (_totalSupply <= creatorMint) {
            return 0;
        }
        uint256 adjustedSupply = _totalSupply - creatorMint;
        uint256 maxAdjustedSupply = MAX_SUPPLY - creatorMint;
        return (FINAL_PRICE * adjustedSupply * adjustedSupply) / (maxAdjustedSupply * maxAdjustedSupply);
    }

    function burn(uint256 tokenId) public nonReentrant {
        uint256 amount = 1;
        require(
            balanceOf(msg.sender, tokenId) >= amount,
            "Insufficient balance for burning"
        );
        uint256 _creatorMint = creatorMintAmount[tokenId];
        uint256 _totalSupply = totalSupply[tokenId];
        
        uint256 refundableSupply = _totalSupply > _creatorMint
            ? _totalSupply - _creatorMint
            : 0;

        uint256 burnPrice = calculatePrice(tokenId, _totalSupply);
        uint256 adminFee = (burnPrice * amount * FEE_RATE) / 1000000; // 0.05% of the refund price
        uint256 refundAmount = (burnPrice * amount) - adminFee;
        totalSupply[tokenId] -= amount;
        
        uint256 totalAmountToSend = refundAmount + adminFee;


        _burn(msg.sender, tokenId, amount);

        currentMintPrice[tokenId] = calculatePrice(tokenId, totalSupply[tokenId] + 1);

        if (refundableSupply > 0 && totalAmountToSend > 0) {
            require(
                tokenEthBalances[tokenId] >= totalAmountToSend,
                "Insufficient ETH balance for refund"
            );
            
            tokenEthBalances[tokenId] -= totalAmountToSend;
            payable(adminWallet).transfer(adminFee);
            payable(msg.sender).transfer(refundAmount);
        }
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
