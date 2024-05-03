import { abi } from './contractABI';
import {  CHAIN_DEFINITIONS} from './constants';
import { createThirdwebClient, getContract, prepareContractCall, toWei , sendTransaction} from 'thirdweb';
const CHAIN_ID = 84532;

const THIRDWEB_CLIENT_ID = process.env.NEXT_PUBLIC_THIRDWEB_ID;

const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID
});


export async function getContractAddress(chainId) {
  chainId = parseInt(chainId, 10);
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESS;
  return CONTRACT_ADDRESS;
}

export function getContractObject() {

const chainId = CHAIN_ID;

  const chainData = CHAIN_DEFINITIONS.find(chain => chain.id.toString() === chainId.toString());

  const CONTRACT_ADDRESS = getContractAddress();
  const contract = getContract({
    client,
    chain: chainData,
    chainId: CHAIN_ID,
    // The ABI for the contract is defined here
    abi: abi,
    address:CONTRACT_ADDRESS
  });
  return contract;
}

export function prepareMintTransaction(tokenId) {
  const contract = getContractObject();
  const tx = prepareContractCall({
    contract,
    // We get auto-completion for all the available functions on the contract ABI
    method: "mint",
    // including full type-safety for the params
    params: [tokenId],
  });

  return tx;

}


export function prepareBurnTransaction() {
  const contract = getContractObject();
  const tx = prepareContractCall({
    contract,
    method: "burn",
    params: [],
  });

  return tx;

}


export async function mintTransaction() {
  const txData = prepareMintTransaction();
  sendTransaction(txData);
}

export async function burnTransaction() {
  const tx = prepareBurnTransaction();
  const receipt = await client.send(tx);
  return receipt;
}
