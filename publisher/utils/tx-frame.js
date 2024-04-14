import { getContract, encode } from 'thirdweb';
import { CLIENT, CHAIN, erc1155ContractAddress } from './constants';

export const getERC1155PreparedEncodedData = async (walletAddress) => {
  const contract = getContract({
    client: CLIENT,
    chain: CHAIN,
    address: erc1155ContractAddress,
  });

  const minTx = prepareContractCall({
    contract,
    method:  'function mint(uint256 tokenId) public payable nonReentrant',
    params: [tokenId],
    account: walletAddress,
  });

  const encodedTx = encode(minTx);
  return encodedTx;

}

export const getFarcasterAccountAddress = async (interactor) => {
  return interactor.verified_accounts ? interactor.verified_accounts[0] : interactor.custody_address;

  
}