import { getGenerationsDB, getSessionsDB } from './Database.js';
import { getImageFromText, getOutpaintImageFromText } from './Dispatcher.js';
import('dotenv/config');
import * as path from 'path';

const API_SERVER = process.env.API_SERVER;


export async function processPendingImageRequests() {
  const generationsDB = await getGenerationsDB();
  const sessionsDB = await getSessionsDB();
  const pendingRequests = await generationsDB.all();
  for (let request of pendingRequests) {
    let requestId;
    try {
      let pendingRequestData = request.value;
      requestId = pendingRequestData._id;
      const prompt = pendingRequestData.prompt;
      const operationType = pendingRequestData.operationType;
      if (operationType === "GENERATE") {

        await processGenerationRequest(pendingRequestData);
      } else if (operationType === "OUTPAINT") {
        await processOutpaintRequest(pendingRequestData);
      }
    } catch (e) {
      console.log("CAUGHT ERROR");
      if (requestId) {
        try {
          await generationsDB.del(requestId);
        } catch (e) {

        }
      }
    }
  }
}


async function processGenerationRequest(pendingRequestData) {

  const generationsDB = await getGenerationsDB();
  const sessionsDB = await getSessionsDB();

  const requestId = pendingRequestData._id;
  const prompt = pendingRequestData.prompt;

  let genDBData = await generationsDB.get(requestId);

  const imageURL = await getImageFromText(pendingRequestData);

  const genRowValue = genDBData.value;
  const sessionData = await sessionsDB.get(genRowValue.sessionId);
  let sessionDataValue = Object.assign({}, sessionData.value);

  if (!sessionDataValue) {
    await generationsDB.del(requestId);
    return;
  }

  sessionDataValue.generationStatus = "COMPLETED";
  sessionDataValue.activeGeneratedImage = imageURL;
  sessionDataValue.activeSelectedImage = imageURL;

  let sessionGenerations = sessionDataValue.generations;
  if (!sessionGenerations) {
    sessionGenerations = [imageURL];
  } else {
    sessionGenerations.push(imageURL);
  }
  sessionDataValue.generations = sessionGenerations;
  sessionDataValue._id = genRowValue.sessionId;
  try {
    await sessionsDB.put(sessionDataValue);
  } catch (e) {
    console.log(e);

  }

  await generationsDB.del(requestId);
}

async function processOutpaintRequest(pendingRequestData) {
  console.log("PROCESSING OUTPAINT REQUEST")

  const generationsDB = await getGenerationsDB();
  const sessionsDB = await getSessionsDB();
  const requestId = pendingRequestData._id;
  const prompt = pendingRequestData.prompt;
  const image = pendingRequestData.image;
  const maskImage = pendingRequestData.maskImage;

  const pwd = process.cwd();

  const targetDirPath = path.resolve(pwd, '../processor/assets/temp/');
  const imageURL = path.resolve(targetDirPath, image);
  const maskImageURL = path.resolve(targetDirPath, maskImage);



  let genDBData = await generationsDB.get(requestId);
  
  const editedImageURL = await getOutpaintImageFromText(pendingRequestData);



  const genRowValue = genDBData.value;
  const sessionData = await sessionsDB.get(genRowValue.sessionId);
  let sessionDataValue = Object.assign({}, sessionData.value);

  if (!sessionDataValue) {
    await generationsDB.del(requestId);
    return;
  }

  sessionDataValue.outpaintStatus = "COMPLETED";
  sessionDataValue.activeOutpaintedImage = editedImageURL;
  sessionDataValue.activeSelectedImage = editedImageURL;


  try {
    await sessionsDB.put(sessionDataValue);
  } catch (e) {
    console.log(e);

  }

  await generationsDB.del(requestId);


}

