

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
  const RESIZE_WIDTH = 675;  // Set new resize dimensions
  const RESIZE_HEIGHT = 675;

  const CANVAS_WIDTH = 1200;  // Set canvas dimensions
  const CANVAS_HEIGHT = 675;

  const imageData = decodeBase64Image(payload.image);
  const imageBaseDirectory = `./assets/twitter/`;
  if (!fs.existsSync(imageBaseDirectory)) {
    fs.mkdirSync(imageBaseDirectory, { recursive: true });
  }
  const publicationId = payload.publicationId;
  const imageName = `${publicationId}.png`;

  // Resize the image to the new dimensions
  const resizedBuffer = await sharp(imageData)
    .resize(RESIZE_WIDTH, RESIZE_HEIGHT)
    .toBuffer();

  // Extend the canvas and center the image
  const extendedBuffer = await sharp(resizedBuffer)
    .extend({
      top: 0,
      bottom: 0,
      left: Math.round((CANVAS_WIDTH - RESIZE_WIDTH) / 2),  // Calculate and round left offset to center the image
      right: Math.round((CANVAS_WIDTH - RESIZE_WIDTH) / 2),
      background: { r: 31, g: 41, b: 55, alpha: 1 }  // Use a transparent background
    })
    .toBuffer();

  const imageFileName = `${imageBaseDirectory}${imageName}`;
  fs.writeFileSync(imageFileName, extendedBuffer);
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