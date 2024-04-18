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


export async function uploadImageToFileSystem(imageFile, imageName) {
  const imageData = decodeBase64Image(imageFile);
  const imageBaseDirectory = './assets/intermediates/';
  if (!fs.existsSync(imageBaseDirectory)) {
    fs.mkdirSync(imageBaseDirectory, { recursive: true });
  }
  const imageFileName = `${imageBaseDirectory}${imageName}`;
  fs.writeFileSync(imageFileName, imageData);  
  return imageFileName;
  
}

export async function uploadMetadataToIpfs(payload) {
  try {
    const metadata = JSON.stringify(payload);
    const uploadResponse = await lighthouse.uploadText(metadata, LT_API_KEY)
    return uploadResponse;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadTempEditImageToFileSystem(payload) {
  const imageData = decodeBase64Image(payload.image);
  const maskImageData = decodeBase64Image(payload.maskImage);
  const imageBaseDirectory = './assets/temp/';
  if (!fs.existsSync(imageBaseDirectory)) {
    fs.mkdirSync(imageBaseDirectory, { recursive: true });
  }

  const imageName = `${payload.sessionId}_edit.png`;
  const imageFileName = `${imageBaseDirectory}${imageName}`;
  fs.writeFileSync(imageFileName, imageData);

  const maskImageName = `${payload.sessionId}_mask.png`;
  const maskImageFileName = `${imageBaseDirectory}${maskImageName}`;
  fs.writeFileSync(maskImageFileName, maskImageData);
  return {
    image: imageName,
    maskImage: maskImageName
  }

}