import { defineChain , getContract, createThirdwebClient, 
  readContract, prepareContractCall, waitForReceipt,
  sendTransaction,} from "thirdweb";
import { privateKeyAccount, privateKeyToAccount } from "thirdweb/wallets";
import { CHAIN_DEFINITIONS } from '../consts/Chains.js';

import { abi } from '../abi/SAMERC1155.js';
import 'dotenv/config';

const THIRDWEB_CLIENT_ID = process.env.THIRDWEB_ID;
const THIRDWEB_CLIENT_SECRET = process.env.THIRDWEB_SECRET_KEY; 

const privateKey = process.env.APP_PRIVATE_KEY;


const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
  secretKey: THIRDWEB_CLIENT_SECRET,
});



const wallet = privateKeyAccount({
  client,
  privateKey: privateKey,
});


export function getContractAddress(chainId) {
  console.log("GETTONG CONTRACT ADDRESS");
  console.log(chainId);
  console.log("EE TEE");

  chainId = parseInt(chainId, 10);

  const DEPLOYMENT_ADDRESS = process.env.DEPLOYMENT_ADDRESS;
  return DEPLOYMENT_ADDRESS;


}

async function getContractForChainId(chainId) {
  const chainData = CHAIN_DEFINITIONS.find(chain => chain.id.toString() === chainId.toString());
  console.log("GOT CHAIN DATA");
  console.log(chainData);

  const CONTRACT_ADDRESS = getContractAddress(chainId);

  console.log(chainData);
  console.log(CONTRACT_ADDRESS);

  console.log("NEEYY");

  const contract = getContract({
    client,
    chain: chainData,
    chainId,
    // The ABI for the contract is defined here
    abi: abi,
    address:CONTRACT_ADDRESS
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
    method:  'setNextTokenURI',
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
    method:  'mintCreator',
    params: [tokenId, allocation, custodyAddress],
  });

  const transactionResult = await sendTransaction({
    transaction,
    account: wallet,
  });

  const receipt = await waitForReceipt(transactionResult);

  return transactionResult;

}

