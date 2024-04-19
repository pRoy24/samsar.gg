import { defineChain , getContract, createThirdwebClient, 
  readContract, prepareContractCall, waitForReceipt,
  sendTransaction,} from "thirdweb";
import { privateKeyAccount, privateKeyToAccount } from "thirdweb/wallets";
import { CHAIN_DEFINITIONS } from '../consts/Chains.js';

import { abi } from '../abi/SAMERC1155.js';
import 'dotenv/config';

const THIRDWEB_CLIENT_ID = process.env.THIRDWEB_ID;
const THIRDWEB_CLIENT_SECRET = process.env.THIRDWEB_SECRET_KEY; 
const contractAddress = process.env.CHAIDO_DEPLOYMENT_ADDRESS;

const privateKey = process.env.APP_PRIVATE_KEY;

const chaidoChainDefinition = CHAIN_DEFINITIONS.find((chain) => chain.key === 'gnosis_chaido');

const chaidoChain = defineChain(chaidoChainDefinition);

const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
  secretKey: THIRDWEB_CLIENT_SECRET,
});

const contract = getContract({
  // the client you have created via `createThirdwebClient()`
  client,
  // the chain the contract is deployed on
  chain: chaidoChain,
  chainId: chaidoChain.id,
  // the contract's address
  address: contractAddress,
  // OPTIONAL: the contract's abi
  abi: abi,
});

const wallet = privateKeyAccount({
  client,
  privateKey: privateKey,
});



export async function setUrlForNextToken(metadataUrl) {

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


export async function mintTokensForCreator(custodyAddress, tokenId, allocation) {
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

  console.log("GOT RECEIPT");

  console.log("test mint normal transaction");
  const mintTransaction = prepareContractCall({
    contract,
    method:  'mint',
    params: [tokenId],
  });

  const mintTransactionResult = await sendTransaction({
    transaction: mintTransaction,
    account: wallet,
  });

  const mintReceipt = await waitForReceipt(mintTransactionResult);
  console.log("SUCCESSFUKL MINT ON BACKEND");
  console.log(mintReceipt);
  
  return transactionResult;

}

