import { getSessionsDB, getPublicationsDB, getUsersDB } from "../storage/Documents.js";
import { v4 as uuidv4 } from 'uuid';
import { addImageGeneratorRequest } from "./Images.js";
import hat from 'hat';
import { uploadImageToIpfs, uploadImageToFileSystem, uploadMetadataToIpfs } from "../storage/Files.js";
import { generateWitnessForFile, createEthSignAttestation } from './Attestation.js';
import { setUrlForNextToken, mintTokensForCreator } from './Contract.js';
import { getChainByKey } from './Utility.js';


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
  const imageName = `${sessionDataValue._id}_${random_string}`;
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

  console.log("ATTESTATION ATTESTATION");
  console.log(attestation);
  const attestationId = attestation.attestationId;



  sessionDataValue.attestationId = attestationId;
  console.log("FEE");

  await db.put(sessionDataValue);
  return sessionDataValue;
}

export async function publishSessionAndSetURI(payload) {

  console.log("PUBLISH SESSION AND SET URI");

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



  const nftMetadata = await uploadMetadataToIpfs(nftmetadata);
  const nftMetadataHash = nftMetadata.data.Hash;
  const imageHash = imageData.data.Hash;

  const nftmetadataurl = `ipfs://${nftMetadataHash}`;

  const nftTokenData = await setUrlForNextToken(nftmetadataurl);

  const { tokenId, hash } = nftTokenData;
  const userCustodyAddress = userDataValue.custody;

  const allocation = payload.creatorAllocation;

  const creatorInitHashData = await mintTokensForCreator(userCustodyAddress, tokenId, allocation);
  
  const creatorInitHash = creatorInitHashData.transactionHash;

  const publicationsDB = await getPublicationsDB();


  const selectedChainKey = payload.selectedChain;

  const chain = getChainByKey(selectedChainKey);
  const publicationId = `${chain.id}_${tokenId}`;

  console.log("PUBLICATION ID", publicationId);



  const publicationsPayload = {
    _id: publicationId,
    sessionId: sessionId,
    imageHash: imageHash,
    createdBy: sessionDataValue.fid,
    creatorInitHash: creatorInitHash,
    tokenId: tokenId,
    generationHash: hash,
    creatorInitAllocation: allocation

  }

  console.log(publicationsPayload);
  console.log("ME NE SEEE TEE SERR");


  await publicationsDB.put(publicationsPayload);

  const uri = `https://gateway.ipfs.io/ipfs/${imageHash}`;
  sessionDataValue.uri = uri;
  await db.put(sessionDataValue);
  return publicationsPayload;

}
