import { abi } from './contractABI';
import { CHAIN } from './constants';
import { createThirdwebClient, getContract, prepareContractCall, toWei , sendTransaction} from 'thirdweb';

 


const THIRDWEB_CLIENT_ID = process.env.NEXT_PUBLIC_THIRDWEB_ID;

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CHAIDO_DEPLOYMENT_ADDRESS;
const client = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID
});

export function getContractObject() {

  const chainId = CHAIN.id;
  console.log("CONTRACT ADDRESS");
  console.log(CONTRACT_ADDRESS);
  console.log("CHAIN ID");
  console.log(chainId);

  const contract = getContract({
    client,
    chain: CHAIN,
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
