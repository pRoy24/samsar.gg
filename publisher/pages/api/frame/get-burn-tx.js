import { validateMessage, getFarcasterAccountAddress } from "../../../utils/pinata";
import { getERC1155PreparedEncodedBurnData, getBalanceForUserForTokenId } from "../../../utils/tx-frame";
import { abi } from "../../../utils/contractABI";
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESS;

import { data } from "autoprefixer";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are allowed' })
  }

  const tokenId = req.query.id;


  console.log("GGG");
  console.log(req.body);

  const { isValid, message} = await validateMessage(req.body); 


  if (!isValid || !message) {
    return res.status(400).json({ error: 'Bad Request', message: 'Invalid message' })
  }



  const address = await getFarcasterAccountAddress(message.data.fid);

  const userBalance = await getBalanceForUserForTokenId(address, tokenId);

  if (userBalance === 0) {
    return res.status(400).json({ error: 'Bad Request', message: 'User does not own this token' })
  }

  const encodedData = await getERC1155PreparedEncodedBurnData(address, tokenId);



  res.status(200).json({
    chainId: `eip155:${CHAIN_ID}`,
    method: 'eth_sendTransaction',
    params: {
      abi: abi,
      to: CONTRACT_ADDRESS,
      data: encodedData,
      value: "0"
    }

  
  });

}