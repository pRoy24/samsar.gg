
import Session from '../schema/Session.js';
import Publication from '../schema/Publication.js';


import { getDBConnectionString } from "./DBString.js";
import { v4 as uuidv4 } from 'uuid';
import { addImageGeneratorRequest, addImageOutpaintRequest } from "./Images.js";
import hat from 'hat';
import { uploadImageToIpfs, uploadImageToFileSystem, uploadMetadataToIpfs, generateTwitterOgImage } from "../storage/Files.js";
import { setUrlForNextToken, mintTokensForCreator } from './Contract.js';
import { getChainById } from './Utility.js';
import { makeCastFromDeveloperAccount } from '../utils/FarcasterHub.js';
import { getNFTMetaData } from './Metadata.js';
import User from "../schema/User.js";
import sharp from 'sharp';
import fs from 'fs';
import { generateWitnessForFile } from './Attestation.js';
import { byteIndexOf, truncateTo320Bytes } from '../utils/StringUtils.js';


export async function createNewSession(userId, payload) {

  const sessionId = uuidv4();
  const sessionPayload = {
    userId: userId,
    generations: [],
    _id: sessionId,
  }
  await getDBConnectionString();
  const sessionData = new Session(sessionPayload);
  const sessionSaveResponse = await sessionData.save();
  return sessionSaveResponse;
}

export async function requestGenerateImage(payload) {
  await getDBConnectionString();
  const sessionId = payload.sessionId;
  const sessionDataValue = await Session.findOne({ _id: sessionId });


  if (!sessionDataValue) {
    return;
  }

  sessionDataValue.generationStatus = "PENDING";
  sessionDataValue.prompt = payload.prompt;
  await addImageGeneratorRequest(payload);
  await sessionDataValue.save();
  return sessionDataValue;
}

export async function requestOutpaintImage(payload) {
  await getDBConnectionString();

  const sessionId = payload.sessionId;
  const sessionDataValue = await Session.findOne({ _id: sessionId });

  sessionDataValue.outpaintStatus = "PENDING";
  sessionDataValue.prompt = payload.prompt;

  await addImageOutpaintRequest(payload);

  const saveRes = await sessionDataValue.save();

  return saveRes;

}

export async function getSessionGenerationStatus(sessionId) {

  await getDBConnectionString();
  const sessionDataValue = await Session.findOne({ _id: sessionId });
  return sessionDataValue;
}



export async function publishSession(payload) {

  await getDBConnectionString();
  const sessionId = payload.sessionId;
  const sessionDataValue = await Session.findOne({ _id: sessionId });

  if (!sessionDataValue) {
    return;
  }
  sessionDataValue.publishStatus = "COMPLETED";
  const imageData = await uploadImageToIpfs(payload.image);
  const imageHash = imageData.data.Hash;
  const publicationsPayload = new Publication({
    _id: productId,
    sessionId: sessionId,
    imageHash: imageHash,
    createdBy: sessionDataValue.userId,
    slug: productId,
  });

  const publicationRes = await publicationsPayload.save();
  return publicationRes;
}

export async function saveIntermediate(payload) {
  //const db = await getSessionsDB();

  await getDBConnectionString();
  const sessionId = payload.sessionId;
  const sessionDataValue = await Session.findOne({ _id: sessionId });



  // Retrieve the intermediates array or initialize as empty if it doesn't exist
  let intermediates = sessionDataValue.intermediates || [];

  const random_string = hat();
  // Generate a new image name and upload the image
  const imageName = `${sessionDataValue._id}_${random_string}.png`;
  const imageData = payload.image;
  const imageFile = await uploadImageToFileSystem(imageData, imageName);

  // Add the new item (imageName in this case) to the beginning of the queue
  intermediates.unshift(imageFile);

  const currentTime = new Date();
  const lastWitnessSavedAt = sessionDataValue.lastWitnessSavedAt || new Date(0);

  const timeDiff = currentTime - lastWitnessSavedAt;
  if (timeDiff > 30000) {
    await updateWitnessForIntermediate(payload.sessionId, imageFile);
  }

  // Ensure the queue doesn't exceed 10 items
  if (intermediates.length > 10) {
    const imgNameToDelete = intermediates.pop();  // Remove the oldest item if the array length exceeds 10
    // await deleteImageFile(imgNameToDelete);
  }

  if (imageName) {
    try {
      // Save the updated intermediates back to the database
      sessionDataValue.intermediates = intermediates;
      sessionDataValue.activeSelectedImage = imageName;

      await sessionDataValue.save({});
      return sessionDataValue;

    } catch (e) {

    }

  }
}

async function updateWitnessForIntermediate(sessionId, imageFile) {

  const imageName = imageFile.split('/').pop();



  const desiredWidth = 100;
  const pwd = process.cwd();

  const outputImageFolder = `${pwd}/assets/intermediates/${sessionId}/`;

  fs.mkdirSync(outputImageFolder, { recursive: true });

  const outputImagePath = `${outputImageFolder}${imageName}`;

  const thumbnailImage = sharp(imageFile).resize({ width: desiredWidth })

  const imageBuffer = await thumbnailImage.toBuffer();

  const imageb64 = imageBuffer.toString('base64');


  thumbnailImage.toFile(outputImagePath, (err, info) => {
    if (err) {
      console.error('Error during image processing:', err);
    } else {
      console.log('Image processed successfully:', info);
    }
  });


  const leafHash = await generateWitnessForFile(imageb64);

  const sessionData = await Session.findOne({
    _id: sessionId
  });

  sessionData.witnesses = sessionData.witnesses || [];
  const imageKey = outputImagePath.split('/intermediates').pop();

  sessionData.witnesses.push({
    image: imageKey,
    hash: leafHash,
  });

  sessionData.lastWitnessSavedAt = new Date();
  await sessionData.save({});


}

export async function getSessionDetails(sessionId) {
  await getDBConnectionString();
  const sessionDataValue = await Session.findOne({ _id: sessionId });
  return sessionDataValue;

}

export async function publishSessionAndSetURI(userId, payload) {

  await getDBConnectionString();

  const sessionId = payload.sessionId;
  const sessionDataValue = await Session.findOne({ _id: sessionId });

  const userDataValue = await User.findOne({ '_id': sessionDataValue.userId });

  sessionDataValue.publishStatus = "COMPLETED";

  const sessionWitnesses = sessionDataValue.witnesses;

  const witnessHashData = await uploadMetadataToIpfs(sessionWitnesses);

  const witnessHash = witnessHashData.IpfsHash;

  const imageData = await uploadImageToIpfs(payload.image);
  const imageURL = `ipfs://${imageData.IpfsHash}`;

  let nftPayload = Object.assign({}, payload.nft);
  nftPayload.image = imageURL;

  nftPayload.attributes = [
    {
      "trait_type": "Witness",
      "value": witnessHash
    }
  ]

  const nftmetadata = getNFTMetaData(nftPayload);

  const selectedChainId = payload.selectedChain;

  const nftMetadata = await uploadMetadataToIpfs(nftmetadata);
  const nftMetadataHash = nftMetadata.IpfsHash;
  const imageHash = imageData.IpfsHash;

  const nftmetadataurl = `ipfs://${nftMetadataHash}`;

  const nftTokenData = await setUrlForNextToken(selectedChainId, nftmetadataurl);

  const { tokenId, hash } = nftTokenData;
  const userCustodyAddress = userDataValue.custody;

  const allocation = payload.creatorAllocation;

  const creatorInitHashData = await mintTokensForCreator(userCustodyAddress, tokenId, selectedChainId, allocation);

  const creatorInitHash = creatorInitHashData.transactionHash;

  const nftName = nftPayload.name;
  const userData = await User.findOne({ _id: userId });



  const publicationsPayload = new Publication({
    slug: tokenId,
    sessionId: sessionId,
    imageHash: imageHash,
    createdBy: userId,
    creatorInitHash: creatorInitHash,
    metadataHash: nftMetadataHash,
    tokenId: tokenId,
    generationHash: hash,
    creatorInitAllocation: allocation,
    nftName: nftPayload.name,
    nftDescription: nftPayload.description,
    creatorHandle: payload.creatorHandle,
    witnessList: sessionWitnesses,
    witnessHash: witnessHash,
  });



  const publicationRes = await publicationsPayload.save({});
  const uri = `https://gateway.ipfs.io/ipfs/${imageHash}`;
  sessionDataValue.uri = uri;
  await sessionDataValue.save({});

  const pageURL = `https://samsar.gg/p/${tokenId}`
  const castText = truncateTo320Bytes(`${nftName} by \n ${nftPayload.description}`);
  const mentionsPosition = byteIndexOf(castText, "\n");
  let fid = -1;
  try {
    fid = parseInt(userData.fid);
  } catch (e) {

  }
  if (isNaN(fid)) {
    fid = -1;
  }
  let castPayload = {
    text: castText,
    embeds: [{ url: pageURL }],
    embedsDeprecated: [],

  };

  if (fid > -1) {
    castPayload.mentions = [fid];
    castPayload.mentionsPositions = [mentionsPosition]
  }

  const CURRENT_ENV = process.env.CURRENT_ENV;
  if (CURRENT_ENV === 'production') {
    makeCastFromDeveloperAccount(castPayload);
  }
  const twitterOGPayload = {
    image: payload.image,
    publicationId: publicationRes._id,
    tokenId: tokenId,
  };

  generateTwitterOgImage(twitterOGPayload);

  return publicationsPayload;
}


export async function getOrCreateSession(payload) {
  await getDBConnectionString();
  const userId = payload.userId;
  const sessionId = payload.sessionId;
  const sessionDataValue = await Session.findOne({ _id: sessionId });

  if (sessionDataValue) {
    return sessionDataValue;
  } else {
    const sessionPayload = new Session({
      userId: userId.toString(),
      generations: [],
      _id: sessionId,
    });
    const sessionSaveResponse = await sessionPayload.save();
    return sessionSaveResponse;
  }
}