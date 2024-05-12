

import 'dotenv/config';
import fs from 'fs';
import { Readable } from 'stream';

import pinataSDK from '@pinata/sdk';
import sharp from 'sharp';

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_API_SECRET;

const pinata = new pinataSDK(PINATA_API_KEY, PINATA_SECRET_API_KEY);
  
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

    const imageStream = Readable.from(imageData);

    const options = {
      pinataMetadata: {
        name: 'samsar_image',
      },
    };

    const uploadResponse = await pinata.pinFileToIPFS(imageStream, options);
    return uploadResponse;
  } catch (error) {
    console.log(error);
  }
}

export async function generateTwitterOgImage(payload) {
  console.log("generating twitter image");
  console.log(payload);

  const RESIZE_WIDTH = 800;
  const publicationId = payload.publicationId;

  const RESIZE_HEIGHT = 800;

  const imageData = decodeBase64Image(payload.image);
  const imageBaseDirectory = `./assets/twitter/`;
  if (!fs.existsSync(imageBaseDirectory)) {
    fs.mkdirSync(imageBaseDirectory, { recursive: true });
  }
  const imageName = `${publicationId}.png`;
  const resizedBuffer = await sharp(imageData).resize(RESIZE_WIDTH, RESIZE_HEIGHT).toBuffer();
  
  const imageFileName = `${imageBaseDirectory}${imageName}`;
  fs.writeFileSync(imageFileName, resizedBuffer);
  return imageFileName;

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
  //  const metadata = JSON.stringify(payload);
    const uploadResponse = await pinata.pinJSONToIPFS(payload);

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