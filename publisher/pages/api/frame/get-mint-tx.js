import { validateMessage } from "../../../utils/pinata";


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are allowed' })
  }

  console.log(req.body)

  const { isValid, message} = validateMessage(req.body); 

  if (!isValid || !message) {
    return res.status(400).json({ error: 'Bad Request', message: 'Invalid message' })
  }

  const address = await getFarcasterAccountAddress(req.body.interactor);
  const encodedData = await getERC1155PreparedEncodedData(address);

  return res.status(200).json({ 
    chainId: '',
    method: '',
    params: {
      abi: abi, 
      to: contractAddress,
      data: encodedData,
      value: "0"
    }
    
   });

}