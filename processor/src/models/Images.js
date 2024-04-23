import { getGenerationsDB } from '../storage/Documents.js';
import { v4 as uuidv4 } from 'uuid';
import { uploadTempEditImageToFileSystem } from '../storage/Files.js';

export async function addImageGeneratorRequest(payload) {

  try {
  const uuid = uuidv4();
  const db = await getGenerationsDB();

  const generationPayload = {
    _id: uuid,
    ...payload,
    generationStatus: "PENDING",
    rowLocked: false,
    operationType: "GENERATE",
  }
  await db.put(generationPayload);
  return generationPayload;
} catch (error) {
}
}



export async function addImageOutpaintRequest(payload) {
  const localImageLinks = await uploadTempEditImageToFileSystem(payload);
  const uuid = uuidv4();
  const queuePayload = {
    _id: uuid,
    outpaintStatus: "PENDING",
    sessionId: payload.sessionId,
    image: localImageLinks.image,
    maskImage: localImageLinks.maskImage,
    rowLocked: false,
    operationType: "OUTPAINT",
    prompt: payload.prompt,
    model: payload.model,
  }


  const db = await getGenerationsDB();
  await db.put(queuePayload);
  return queuePayload;


}