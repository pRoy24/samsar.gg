
import Session from '../schema/Session.js';
import Publication from '../schema/Publication.js';


import { getDBConnectionString } from "./DBString.js";
import { v4 as uuidv4 } from 'uuid';
import { addImageGeneratorRequest , addImageOutpaintRequest } from "./Images.js";
import hat from 'hat';
import { uploadImageToIpfs, uploadImageToFileSystem, uploadMetadataToIpfs } from "../storage/Files.js";
import { setUrlForNextToken, mintTokensForCreator } from './Contract.js';
import { getChainById } from './Utility.js';

import { getNFTMetaData } from './Metadata.js';
import User from "../schema/User.js";


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

  // updateWitnessForIntermediate(payload.sessionId, imageName, imageData);

  // Ensure the queue doesn't exceed 10 items
  if (intermediates.length > 10) {
    const imgNameToDelete = intermediates.pop();  // Remove the oldest item if the array length exceeds 10
    await deleteImageFile(imgNameToDelete);
  }

  // Save the updated intermediates back to the database
  sessionDataValue.intermediates = intermediates;
  sessionDataValue.activeSelectedImage = imageName;
  
  await sessionDataValue.save();
  return sessionDataValue;

}

async function updateWitnessForIntermediate(sessionId, imageName, imageData) {
  // const leafHash = await generateWitnessForFile(imageData);

  // const db = await getSessionsDB();
  // const sessionData = await db.get(sessionId);
  // const sessionDataValue = sessionData.value;


  // sessionDataValue.witnesses = sessionDataValue.witnesses || [];
  // sessionDataValue.witnesses.push({
  //   imageName: imageName,
  //   leafHash: leafHash,
  // });
  // await db.put(sessionDataValue);

}

export async function getSessionDetails(sessionId) {
  await getDBConnectionString();
  const sessionDataValue = await Session.findOne({ _id: sessionId });
  return sessionDataValue;

}


export async function createAttestation(payload) {
  // const db = await getSessionsDB();
  // const userDB = await getUsersDB();
  
  // const sessionId = payload.sessionId;
  // const fid = payload.fid;

  // const sessionData = await db.get(sessionId);
  // const sessionDataValue = sessionData.value;


  // const userData = await userDB.get(fid);
  // const userDataValue = userData.value;

  // const attesterPrivateKey = userDataValue.attesterPrivateKey;

  // let attestationPayload = {
  //   name: sessionData._id
  // }
  // const attestation = await createEthSignAttestation(attestationPayload);

  // const attestationId = attestation.attestationId;

  // sessionDataValue.attestationId = attestationId;

  // await db.put(sessionDataValue);
  // return sessionDataValue;
}

export async function publishSessionAndSetURI(payload) {

  console.log("PUBLISHING SESSION");
  console.log(payload);


  await getDBConnectionString();

  const sessionId = payload.sessionId;
  const sessionDataValue = await Session.findOne({ _id: sessionId });

  const userDataValue = await User.findOne({'_id': sessionDataValue.userId});

  sessionDataValue.publishStatus = "COMPLETED";
  const imageData = await uploadImageToIpfs(payload.image);
  const imageURL = `ipfs://${imageData.data.Hash}`;
  payload.nft.image = imageURL;


  const nftmetadata = getNFTMetaData(payload.nft);

  const selectedChainId = payload.selectedChain;

  const nftMetadata = await uploadMetadataToIpfs(nftmetadata);
  const nftMetadataHash = nftMetadata.data.Hash;
  const imageHash = imageData.data.Hash;

  const nftmetadataurl = `ipfs://${nftMetadataHash}`;

  const nftTokenData = await setUrlForNextToken(selectedChainId, nftmetadataurl);

  const { tokenId, hash } = nftTokenData;
  const userCustodyAddress = userDataValue.custody;

  const allocation = payload.creatorAllocation;

  const creatorInitHashData = await mintTokensForCreator(userCustodyAddress, tokenId, selectedChainId, allocation);
  
  const creatorInitHash = creatorInitHashData.transactionHash;




  const chain = getChainById(selectedChainId);


  const publicationId = `${chain.id}_${tokenId}`;

  const publicationsPayload = new Publication({
    slug: tokenId,
    sessionId: sessionId,
    imageHash: imageHash,
    createdBy: sessionDataValue.fid,
    creatorInitHash: creatorInitHash,
    metadataHash: nftMetadataHash,
    tokenId: tokenId,
    generationHash: hash,
    creatorInitAllocation: allocation

  });


  await publicationsPayload.save();

  const uri = `https://gateway.ipfs.io/ipfs/${imageHash}`;
  sessionDataValue.uri = uri;
  await sessionDataValue.save();

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