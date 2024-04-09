import { getGenerationsDB } from '../storage/Documents.js';
import { v4 as uuidv4 } from 'uuid';

export async function addImageGeneratorRequest(payload) {

  const uuid = uuidv4();
  const db = await getGenerationsDB();
  const generationPayload = {
    _id: uuid,
    ...payload,
    generationStatus: "PENDING",
    rowLocked: false,
  }
  await db.put(generationPayload);
  return generationPayload;
}

