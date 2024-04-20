import { abi } from './contractABI';
import {  CHAIN_DEFINITIONS} from './constants';
import { createThirdwebClient, getContract, prepareContractCall, toWei , sendTransaction} from 'thirdweb';

const THIRDWEB_CLIENT_ID = process.env.NEXT_PUBLIC_THIRDWEB_ID;

const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID
});


export async function getContractAddress(chainId) {
  chainId = parseInt(chainId, 10);

  const CHAIDO_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CHAIDO_DEPLOYMENT_ADDRESS;
  const ARBI_SEPOLIA_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ARBI_SEPOLIA_DEPLOYMENT_ADDRESS;
  if (chainId === 421614) {
    return ARBI_SEPOLIA_CONTRACT_ADDRESS; 
  } else {
    return CHAIDO_CONTRACT_ADDRESS;
  }
}

export function getContractObject(chainId) {


  const chainData = CHAIN_DEFINITIONS.find(chain => chain.id.toString() === chainId.toString());

  const CONTRACT_ADDRESS = getContractAddress(chainId);
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




export function prepareMintTransaction(tokenId) {
  const contract = getContractObject();

  console.log("GOT TOKEN ID");
  console.log(tokenId);
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
