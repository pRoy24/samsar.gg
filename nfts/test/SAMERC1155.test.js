const { expect } = require("chai");
const { ethers } = require("hardhat");


function getOffchainMintPrice(payload) {
  const { totalSupply, creatorAllocation} =  payload;
  console.log(payload);
  console.log("EE");

    const FINAL_PRICE = BigInt('1000000000000000000'); // 1e18
    const MAX_SUPPLY = 10000;

    if (totalSupply <= creatorAllocation) {
        return BigInt(0);
    }
    const adjustedSupply = BigInt(totalSupply - creatorAllocation);
    const maxAdjustedSupply = BigInt(MAX_SUPPLY - creatorAllocation);
    return (FINAL_PRICE * adjustedSupply * adjustedSupply) / (maxAdjustedSupply * maxAdjustedSupply);
}


function getOffchainBurnPrice(payload) {
  const { totalSupply, creatorAllocation, burnAmount} =  payload;

  try {
  const FINAL_PRICE = BigInt('1000000000000000000'); // 1e18
  const MAX_SUPPLY = BigInt(10000);
  const FEE_RATE = BigInt(50); // 0.05%
  const ONE_HUNDRED_THOUSAND = BigInt(1000000); // Divisor to calculate the fee rate

  let totalRefundAmount = BigInt(0);
  let totalAdminFees = BigInt(0);


  let currentSupply = BigInt(totalSupply);

  // Calculate the price for each token at the time it was minted and sum it up
  for (let i = 0; i < burnAmount; i++) {
      if (currentSupply <= creatorAllocation) {
          break; // No price for tokens within the creator mint range
      }
      const adjustedSupply = currentSupply - creatorAllocation;

      const maxAdjustedSupply = BigInt(MAX_SUPPLY - creatorAllocation);
      const price = (FINAL_PRICE * adjustedSupply * adjustedSupply) / (maxAdjustedSupply * maxAdjustedSupply);
      if (price > 0) {
          const adminFee = (price * FEE_RATE) / ONE_HUNDRED_THOUSAND;
          totalAdminFees += adminFee;
          totalRefundAmount += (price - adminFee);
      }
      currentSupply -= BigInt(1);
  }

  return { refundAmount: totalRefundAmount, adminFees: totalAdminFees };
} catch (error) {
  console.log(error);
}
}



describe("SAMERC1155", function () {
  let SAMERC1155;
  let samerc1155;
  let owner, addr1, addr2, addr3, admin;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3, admin] = await ethers.getSigners();

    SAMERC1155 = await ethers.getContractFactory("SAMERC1155");
  
    samerc1155 = await SAMERC1155.deploy(owner.address, admin.address);
    await samerc1155.waitForDeployment();

    const address = await samerc1155.getAddress();
    // Set a dummy URI for a token by the owner
    const dummyTokenId = 0; // Example token ID
    const dummyURI = "https://example.com/token/0";
    await samerc1155.connect(owner).setURI(dummyTokenId, dummyURI);

    // Admin mints tokens with dummy values for initial setup
    const dummyAmount = 100; // Example amount for creator mint
    await samerc1155.connect(admin).mintCreator(dummyTokenId, dummyAmount, addr3.address);

    const creatorBalance = await samerc1155.balanceOf(owner.address, dummyTokenId);
    console.log("CREATOR BALANCE", creatorBalance);


  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await samerc1155.owner()).to.equal(owner.address);
    });

    it("Should set the right admin wallet", async function () {
      expect(await samerc1155.adminWallet()).to.equal(admin.address);
    });
  });

  describe("Minting", function () {
    it("Should mint a token after setting URI and creator mint", async function () {
      const tokenId = 0;
      const tokenURI = "https://example.com/token/0";
      const currentMintPrice = await samerc1155.currentMintPrice(tokenId);
      await samerc1155.connect(addr1).mint(tokenId, { value: currentMintPrice.toString() });
      expect(await samerc1155.balanceOf(addr1.address, tokenId)).to.equal(1);
      expect(await samerc1155.uri(tokenId)).to.equal(tokenURI);
    });

    it("Should mint 10 tokens from 1000 different wallet addresses", async function () {
      const tokenId = 0;
      

      for (let i = 0; i < 10; i++) {
        const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
        const currentMintPrice = await samerc1155.currentMintPrice(tokenId);
        const fundingValue = '10000000000000000000'; // 1 Ether
        const fundingTx = await owner.sendTransaction({
          to: wallet.address,
          value: fundingValue// Sending 1 Ether to cover gas fees and minting cost
        });
        await fundingTx.wait();


        const tx = await samerc1155.connect(wallet).mint(tokenId, { value: currentMintPrice });
        await tx.wait();

        const balance = await samerc1155.balanceOf(wallet.address, tokenId);
        expect(balance).to.equal(1);

      }

      const totalSupply = await samerc1155.totalSupply(tokenId);
      expect(totalSupply).to.equal(110);

      const expectedPayload = {
        totalSupply: 111,
        creatorAllocation: 100
      };

      const expectedPrice = getOffchainMintPrice(expectedPayload);
      const currentMintPrice = await samerc1155.currentMintPrice(tokenId);
      expect(currentMintPrice).to.equal(expectedPrice.toString());
      
    });
  });



  describe("Refund after burn", function () {
    it("Should refund correct amount after burn", async function () {

      const tokenId = 0;
      
      const currentMintPrice = await samerc1155.currentMintPrice(tokenId);
      await samerc1155.connect(addr2).mint(tokenId, { value: currentMintPrice.toString() });


      const prevBalance = await ethers.provider.getBalance(addr2.address);
      const prevAdminWalletBalance = await ethers.provider.getBalance(admin.address);
      const tx = await samerc1155.connect(addr2).burn(tokenId);
      const receipt = await tx.wait();
      // Calculate the gas used in the transaction
      const gasUsed = receipt.gasUsed;
      const txDetails = await ethers.provider.getTransaction(tx.hash);
      const gasCost = gasUsed * txDetails.gasPrice;

      const FEE_RATE = BigInt(50); // 0.05%
      const ONE_HUNDRED_THOUSAND = BigInt(1000000); // Divisor to calculate the fee rate

      const adminFee = (currentMintPrice * FEE_RATE) / ONE_HUNDRED_THOUSAND;
      const refund = currentMintPrice - adminFee;

     // const refundAmount = currentMintPrice - BigInt(0.05/100*currentMintPrice)
      const balance = await ethers.provider.getBalance(addr2.address);
      expect(balance).to.equal(prevBalance - gasCost + refund);


      const adminWalletBalance = await ethers.provider.getBalance(admin.address);

      expect(adminWalletBalance).to.equal(prevAdminWalletBalance + adminFee);

    });
  });

  describe("Burning", function () {
    it("Should burn a token and reduce total supply", async function () {
      const tokenId = 0;
      const currentMintPrice = await samerc1155.currentMintPrice(tokenId);
      await samerc1155.connect(addr2).mint(tokenId, { value: currentMintPrice.toString() });
      await samerc1155.connect(addr2).burn(tokenId);

      expect(await samerc1155.totalSupply(tokenId)).to.equal(100);
      expect(await samerc1155.connect(addr2).balanceOf(addr2.address, tokenId)).to.equal(0);
    });
  });

  describe("Admin Functions", function () {
    it("Admin should burn creator tokens", async function () {
      const tokenId = 0;
   //   await samerc1155.connect(admin).mintCreator(tokenId, 500, addr1.address);
      await samerc1155.connect(admin).burnCreator(tokenId, 100, addr3.address, "0", "0");
      expect(await samerc1155.totalSupply(tokenId)).to.equal(0);
      expect(await samerc1155.balanceOf(addr3.address, tokenId)).to.equal(0);
    });
  });
});
