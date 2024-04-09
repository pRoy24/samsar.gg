import lighthouse from '@lighthouse-web3/sdk'
import 'dotenv/config';
import fs from 'fs';

const LT_API_KEY = process.env.LIGHTHOUSE_KEY;


const decodeBase64Image = (dataString) => {
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid input string');
  }
  return Buffer.from(matches[2], 'base64');
};


export async function uploadImageToIpfs(fileData) {

  try {


    const imageData = decodeBase64Image(fileData);


    const uploadResponse = await lighthouse.uploadBuffer(
      imageData,
      LT_API_KEY,
      'image/png'
    )
    return uploadResponse;

  } catch (error) {
    console.log(error);
  }
}


