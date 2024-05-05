
import { prepareContractCall, getContract, encode , createThirdwebClient, readContract} from 'thirdweb';
import { abi } from './contractABI.js';
const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY,
});

import { CHAIN } from './constants.js';

const contractAddress = process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESS;

export const getERC1155PreparedEncodedMintData = async (address, tokenId) => {
  const contract = getContract({
    client: client,
    chain: CHAIN,
    address: contractAddress,
    abi: abi
  });

  const transaction = prepareContractCall({
    contract,
    method: 'mint',
    params: [tokenId],
    to: address
  });

  const encodedTransactionData = encode(transaction);
  return encodedTransactionData;
}

export const getERC1155PreparedEncodedBurnData = async (address, tokenId) => {
  const contract = getContract({
    client: client,
    chain: CHAIN,
    address: contractAddress,
    abi: abi
  });

  const transaction = prepareContractCall({
    contract,
    method: 'burn',
    params: [tokenId],
    to: address
  });

  const encodedTransactionData = encode(transaction);
  return encodedTransactionData;
}

export async function getMintPrice(tokenId) {


  const contract = getContract({
    client: client,
    chain: CHAIN,
    address: contractAddress,
    abi: abi
  });

  const mintPrice = await readContract({
    contract,
    method: 'currentMintPrice',
    params: [parseInt(tokenId)],
  });
  return mintPrice.toString();


}