import { getDBConnectionString } from './DBString.js';
import Generation from '../schema/Generation.js';
import { v4 as uuidv4 } from 'uuid';
import { uploadTempEditImageToFileSystem } from '../storage/Files.js';

export async function addImageGeneratorRequest(payload) {

  try {

    console.log(payload);


  await getDBConnectionString();


  const generationPayload = new Generation({

    ...payload,
    generationStatus: "PENDING",
    rowLocked: false,
    operationType: "GENERATE",
  });


  console.log(generationPayload);
  
  await generationPayload.save();
  return generationPayload;
} catch (error) {
}
}



export async function addImageOutpaintRequest(payload) {
  const localImageLinks = await uploadTempEditImageToFileSystem(payload);

  await getDBConnectionString();
  const queuePayload = new Generation({

    outpaintStatus: "PENDING",
    sessionId: payload.sessionId,
    image: localImageLinks.image,
    maskImage: localImageLinks.maskImage,
    rowLocked: false,
    operationType: "OUTPAINT",
    prompt: payload.prompt,
    model: payload.model,
    guidanceScale: payload.guidanceScale,
    numInferenceSteps: payload.numInferenceSteps,
    strength: payload.strength,
  });

  await queuePayload.save({});
  return queuePayload;



}