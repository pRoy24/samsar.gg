import {
  defineChain, getContract, createThirdwebClient,
  readContract, prepareContractCall, waitForReceipt,
  sendTransaction,
} from "thirdweb";
import { privateKeyAccount, privateKeyToAccount } from "thirdweb/wallets";
import { CHAIN_DEFINITIONS } from '../consts/Chains.js';

import { abi } from '../abi/SAMERC1155.js';
import {
  generatePriceChart
} from './Graph.js';

import 'dotenv/config';
import fs from 'fs';
import path from 'path';



const THIRDWEB_CLIENT_ID = process.env.THIRDWEB_ID;
const THIRDWEB_CLIENT_SECRET = process.env.THIRDWEB_SECRET_KEY;

const privateKey = process.env.ADMIN_WALLET_PRIVATE_KEY;

const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
  secretKey: THIRDWEB_CLIENT_SECRET,
});

const wallet = privateKeyAccount({
  client,
  privateKey: privateKey,
});

export function getContractAddress(chainId) {
  chainId = parseInt(chainId, 10);
  const DEPLOYMENT_ADDRESS = process.env.DEPLOYMENT_ADDRESS;
  return DEPLOYMENT_ADDRESS;
}

async function getContractForChainId(chainId) {
  const chainData = CHAIN_DEFINITIONS.find(chain => chain.id.toString() === chainId.toString());
  const CONTRACT_ADDRESS = getContractAddress(chainId);
  const contract = getContract({
    client,
    chain: chainData,
    chainId,
    // The ABI for the contract is defined here
    abi: abi,
    address: CONTRACT_ADDRESS
  });
  return contract;
}



export async function setUrlForNextToken(chainId, metadataUrl) {

  const contract = await getContractForChainId(chainId);

  const nextToken = await readContract({
    contract,
    method: 'getNextTokenId',
  });

  const nextTokenId = nextToken.toString();

  const transaction = prepareContractCall({
    contract,
    // We get auto-completion for all the available functions on the contract ABI
    method: 'setNextTokenURI',
    // including full type-safety for the params
    params: [metadataUrl],
  });

  const transactionResult = await sendTransaction({
    transaction,
    account: wallet,
  });

  const receipt = await waitForReceipt(transactionResult);
  const returnPayload = {
    hash: receipt.transactionHash,
    tokenId: nextTokenId,
  }

  return returnPayload;
}


export async function mintTokensForCreator(custodyAddress, tokenId, chainId, allocation) {
  const contract = await getContractForChainId(chainId);
  tokenId = parseInt(tokenId);
  allocation = parseInt(allocation);

  const transaction = prepareContractCall({
    contract,
    method: 'mintCreator',
    params: [tokenId, allocation, custodyAddress],
  });

  const transactionResult = await sendTransaction({
    transaction,
    account: wallet,
  });

  const receipt = await waitForReceipt(transactionResult);

  return transactionResult;

}

export async function getContractMeta(tokenId) {


  const currentSupply = await getTokenSupply(tokenId);
  let creatorAllocation = await getCreatorAllocation(tokenId);

  const mintPrice = await getMintPrice(tokenId, currentSupply, creatorAllocation);

  const pwd = process.cwd();
  const appPath = path.join(pwd, 'assets', 'price', `${tokenId}.png`);

  creatorAllocation = parseInt(creatorAllocation.toString());
  const totalSupply = 10000;


  const payload = {
    tokenId,
    maxSupply: totalSupply,
    creatorMintAmount: creatorAllocation,
    currentSupply: parseInt(currentSupply),
    appPath,
    mintPrice: parseFloat(mintPrice),

  };

  await generatePriceChart(payload);

  return {
    supply: currentSupply,
    creatorAllocation: creatorAllocation,
    price: mintPrice,
  }
}


export async function getTokenSupply(tokenId) {
  const CHAIN_ID = process.env.CHAIN_ID;
  const contract = await getContractForChainId(CHAIN_ID);
  tokenId = parseInt(tokenId);
  const supply = await readContract({
    contract,
    method: 'totalSupply',
    params: [tokenId],
  });

  return supply.toString();
}

export async function getCreatorAllocation(tokenId) {
  const CHAIN_ID = process.env.CHAIN_ID;
  const contract = await getContractForChainId(CHAIN_ID);
  tokenId = parseInt(tokenId);
  const allocation = await readContract({
    contract,
    method: 'creatorMintAmount',
    params: [tokenId],
  });

  return allocation.toString();
}


export async function getMintPrice(tokenId, totalSupply, creatorMintAmount) {
  // Example Usage:
  const FINAL_PRICE = 1e18; // 1 ETH
  const MAX_SUPPLY = 10000;

  const price = calculatePrice(totalSupply, FINAL_PRICE, MAX_SUPPLY, creatorMintAmount);
  console.log("The price of the token is:", price);
  return price;


}

function calculatePrice(totalSupply, finalPrice, maxSupply, creatorMintAmount) {
  if (totalSupply <= creatorMintAmount) {
    return 0;
  }

  const adjustedSupply = totalSupply - creatorMintAmount;
  const maxAdjustedSupply = maxSupply - creatorMintAmount;
  const price = (finalPrice * adjustedSupply * adjustedSupply) / (maxAdjustedSupply * maxAdjustedSupply);
  const priceETH = price / 1e18;
  return priceETH.toFixed(8);
}



export async function getBurnPrice(tokenId) {

}



