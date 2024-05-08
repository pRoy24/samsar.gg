import { getImageFromText, getOutpaintImageFromText } from './Dispatcher.js';
import { getDBConnectionString } from './DBString.js';
import Generation from './schema/Generation.js';
import Session from './schema/Session.js';

import('dotenv/config');
import * as path from 'path';

const API_SERVER = process.env.API_SERVER;


export async function processPendingImageRequests() {
  await getDBConnectionString();

  const pendingRequests = await Generation.find({});

  console.log("PENDING REQUESTS");
  console.log(pendingRequests);

  for (let pendingRequestData of pendingRequests) {
    let requestId;
    try {


      requestId = pendingRequestData._id;
      const operationType = pendingRequestData.operationType;
      if (operationType === "GENERATE") {

        await processGenerationRequest(pendingRequestData);
      } else if (operationType === "OUTPAINT") {
        await processOutpaintRequest(pendingRequestData);
      }

      
    } catch (e) {
      console.log("CAUGHT ERROR");
    
      console.log(e);

      if (requestId) {
        try {
          await Generation.deleteOne({ _id: requestId });

        } catch (e) {

        }
      }
    }
  }
}


async function processGenerationRequest(pendingRequestData) {

  await getDBConnectionString();
  const requestId = pendingRequestData._id;
  const prompt = pendingRequestData.prompt;

  let genRowValue = await Generation.findOne({ _id: requestId });
  const imageURL = await getImageFromText(pendingRequestData);

  let sessionDataValue = await Session.findOne({ _id: genRowValue.sessionId });
  if (!sessionDataValue) {
    await Generation.deleteOne({ _id: requestId })
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
  try {
    await sessionDataValue.save({});
  } catch (e) {
    console.log(e);

  }

  await Generation.deleteOne({ _id: requestId });
}

async function processOutpaintRequest(pendingRequestData) {

  await getDBConnectionString();

  const requestId = pendingRequestData._id;
  const prompt = pendingRequestData.prompt;
  const image = pendingRequestData.image;
  const maskImage = pendingRequestData.maskImage;

  const pwd = process.cwd();

  const targetDirPath = path.resolve(pwd, '../processor/assets/temp/');
  const imageURL = path.resolve(targetDirPath, image);
  const maskImageURL = path.resolve(targetDirPath, maskImage);
  let genRowValue = await Generation.findOne({ _id: requestId });
  
  const editedImageURL = await getOutpaintImageFromText(pendingRequestData);
  const sessionDataValue = await Session.findOne({ _id: genRowValue.sessionId });

  if (!sessionDataValue) {
    await Generation.deleteOne({ _id: requestId });
    return;
  }

  sessionDataValue.outpaintStatus = "COMPLETED";
  sessionDataValue.activeOutpaintedImage = editedImageURL;
  sessionDataValue.activeSelectedImage = editedImageURL;


  console.log(sessionDataValue);


  try {
    await sessionDataValue.save({});
  } catch (e) {
    console.log(e);

  }

  await Generation.deleteOne({ _id: requestId });


}

