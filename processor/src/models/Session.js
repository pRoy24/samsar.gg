import { getSessionsDB , getProductsDB } from "../storage/Documents.js";
import { v4 as uuidv4 } from 'uuid';
import { addImageGeneratorRequest } from "./Images.js";
import { uploadImageToIpfs } from "../storage/Files.js";

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
  console.log(sessionDataValue);
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


  const productDB = await getProductsDB();
  const productId = uuidv4();
  const productPayload = {
    _id: productId,
    sessionId: sessionId,
    imageHash: imageHash,
    createdBy: sessionDataValue.fid,
    slug: productId,
  }

  await productDB.put(productPayload);




  await db.put(sessionDataValue);
  return sessionDataValue;
}