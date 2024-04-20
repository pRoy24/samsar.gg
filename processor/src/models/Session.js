import { getSessionsDB, getPublicationsDB, getUsersDB } from "../storage/Documents.js";
import { v4 as uuidv4 } from 'uuid';
import { addImageGeneratorRequest , addImageOutpaintRequest } from "./Images.js";
import hat from 'hat';
import { uploadImageToIpfs, uploadImageToFileSystem, uploadMetadataToIpfs } from "../storage/Files.js";
import { generateWitnessForFile, createEthSignAttestation } from './Attestation.js';
import { setUrlForNextToken, mintTokensForCreator } from './Contract.js';
import { getChainById } from './Utility.js';


import { getNFTMetaData } from './Metadata.js';

export async function testConnection() {
  const dbConn = await getSessionsDocument();
}

export async function createNewSession(payload) {
  const fid = payload.fid;
  const sessionId = uuidv4();
  const sessionPayload = {
    fid: fid.toString(),
    generations: [],
    _id: sessionId,
  }
  const db = await getSessionsDB();
  await db.put(sessionPayload);

  return sessionPayload;
}

export async function requestGenerateImage(payload) {
  const db = await getSessionsDB();
  const sessionId = payload.sessionId;
  const sessionData = await db.get(sessionId);

  if (!sessionData) {
    return;
  }
  const sessionDataValue = sessionData.value;
  sessionDataValue.generationStatus = "PENDING";
  sessionDataValue.prompt = payload.prompt;
  await addImageGeneratorRequest(payload);
  await db.put(sessionDataValue);
  return sessionDataValue;
}

export async function requestOutpaintImage(payload) {
  const db = await getSessionsDB();
  const sessionId = payload.sessionId;
  const sessionData = await db.get(sessionId);

  if (!sessionData) {
    return;
  }
  const sessionDataValue = sessionData.value;
  sessionDataValue.outpaintStatus = "PENDING";
  sessionDataValue.prompt = payload.prompt;
  await addImageOutpaintRequest(payload);
  
  await db.put(sessionDataValue);
  return sessionDataValue;

}

export async function getSessionGenerationStatus(sessionId) {
  const db = await getSessionsDB();
  const sessionData = await db.get(sessionId);
  if (sessionData) {
    return sessionData.value;
  }
}



export async function publishSession(payload) {
  const db = await getSessionsDB();
  const sessionId = payload.sessionId;
  const sessionData = await db.get(sessionId);
  const sessionDataValue = sessionData.value;

  sessionDataValue.publishStatus = "COMPLETED";
  const imageData = await uploadImageToIpfs(payload.image);
  const imageHash = imageData.data.Hash;
  const publicationsDB = await getPublicationsDB();

  const publicationsPayload = {
    _id: productId,
    sessionId: sessionId,
    imageHash: imageHash,
    createdBy: sessionDataValue.fid,
    slug: productId,
  }
  await publicationsDB.put(publicationsPayload);

  await db.put(sessionDataValue);
  return sessionDataValue;
}

export async function saveIntermediate(payload) {
  const db = await getSessionsDB();

  // Fetch existing session data from the database
  const sessionData = await db.get(payload.sessionId);
  const sessionDataValue = sessionData.value;

  // Retrieve the intermediates array or initialize as empty if it doesn't exist
  let intermediates = sessionDataValue.intermediates || [];

  const random_string = hat();
  // Generate a new image name and upload the image
  const imageName = `${sessionDataValue._id}_${random_string}.png`;
  const imageData = payload.image;
  const imageFile = await uploadImageToFileSystem(imageData, imageName);

  // Add the new item (imageName in this case) to the beginning of the queue
  intermediates.unshift(imageFile);

  updateWitnessForIntermediate(payload.sessionId, imageName, imageData);

  // Ensure the queue doesn't exceed 10 items
  if (intermediates.length > 10) {
    const imgNameToDelete = intermediates.pop();  // Remove the oldest item if the array length exceeds 10
    await deleteImageFile(imgNameToDelete);
  }

  // Save the updated intermediates back to the database
  sessionDataValue.intermediates = intermediates;
  sessionDataValue.activeSelectedImage = imageName;
  await db.put(sessionDataValue);

}

async function updateWitnessForIntermediate(sessionId, imageName, imageData) {
  const leafHash = await generateWitnessForFile(imageData);

  const db = await getSessionsDB();
  const sessionData = await db.get(sessionId);
  const sessionDataValue = sessionData.value;


  sessionDataValue.witnesses = sessionDataValue.witnesses || [];
  sessionDataValue.witnesses.push({
    imageName: imageName,
    leafHash: leafHash,
  });
  await db.put(sessionDataValue);

}

export async function getSessionDetails(sessionId) {
  const db = await getSessionsDB();
  const sessionData = await db.get(sessionId);
  return sessionData.value;
}


export async function createAttestation(payload) {
  const db = await getSessionsDB();
  const userDB = await getUsersDB();
  const sessionId = payload.sessionId;
  const fid = payload.fid;

  const sessionData = await db.get(sessionId);
  const sessionDataValue = sessionData.value;


  const userData = await userDB.get(fid);
  const userDataValue = userData.value;

  const attesterPrivateKey = userDataValue.attesterPrivateKey;

  let attestationPayload = {
    name: sessionData._id
  }
  const attestation = await createEthSignAttestation(attestationPayload);

  const attestationId = attestation.attestationId;

  sessionDataValue.attestationId = attestationId;

  await db.put(sessionDataValue);
  return sessionDataValue;
}

export async function publishSessionAndSetURI(payload) {

  const db = await getSessionsDB();
  const userDB = await getUsersDB();

  const sessionId = payload.sessionId;
  const sessionData = await db.get(sessionId);
  const sessionDataValue = sessionData.value;
  const userData = await userDB.get(sessionDataValue.fid);
  const userDataValue = userData.value;


  sessionDataValue.publishStatus = "COMPLETED";
  const imageData = await uploadImageToIpfs(payload.image);
  const imageURL = `ipfs://${imageData.data.Hash}`;
  payload.nft.image = imageURL;


  const nftmetadata = getNFTMetaData(payload.nft);

  const selectedChainId = payload.selectedChain;

  console.log("SELECTED CHAIN ID");
  console.log(selectedChainId);
  

  const nftMetadata = await uploadMetadataToIpfs(nftmetadata);
  const nftMetadataHash = nftMetadata.data.Hash;
  const imageHash = imageData.data.Hash;

  const nftmetadataurl = `ipfs://${nftMetadataHash}`;

  console.log("GOT NFT METADATA URL");
  console.log(nftmetadataurl);

  const nftTokenData = await setUrlForNextToken(selectedChainId, nftmetadataurl);

  const { tokenId, hash } = nftTokenData;
  const userCustodyAddress = userDataValue.custody;

  const allocation = payload.creatorAllocation;

  const creatorInitHashData = await mintTokensForCreator(userCustodyAddress, tokenId, selectedChainId, allocation);
  
  const creatorInitHash = creatorInitHashData.transactionHash;

  const publicationsDB = await getPublicationsDB();


  const chain = getChainById(selectedChainId);


  const publicationId = `${chain.id}_${tokenId}`;

  const publicationsPayload = {
    _id: publicationId,
    sessionId: sessionId,
    imageHash: imageHash,
    createdBy: sessionDataValue.fid,
    creatorInitHash: creatorInitHash,
    metadataHash: nftMetadataHash,
    tokenId: tokenId,
    generationHash: hash,
    creatorInitAllocation: allocation

  }

  await publicationsDB.put(publicationsPayload);

  const uri = `https://gateway.ipfs.io/ipfs/${imageHash}`;
  sessionDataValue.uri = uri;
  await db.put(sessionDataValue);
  return publicationsPayload;

}
