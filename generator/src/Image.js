import { getGenerationsDB, getSessionsDB } from './db.js';
import { getImageFromText } from './OpenAI.js';
export async function processPendingImageRequests() {
  const generationsDB = await getGenerationsDB();
  const sessionsDB = await getSessionsDB();

  const pendingRequests = await generationsDB.all();


  for (let request of pendingRequests) {
    try {

      let pendingRequestData = request.value;
      const requestId = pendingRequestData._id;
      const prompt = pendingRequestData.prompt;
      console.log(requestId);
      let genDBData = await generationsDB.get(requestId);
      const imageURL = await getImageFromText(prompt);
      console.log(imageURL);
      console.log("GERMANS DONT WANT");

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

      console.log("FEEE");
      console.log(sessionDataValue);
      sessionDataValue._id = genRowValue.sessionId;
      console.log(genRowValue.sessionId);

      try {
        await sessionsDB.put(sessionDataValue);
      } catch (e) {
        console.log(e);
      }
      console.log("DELETING GEN ROW");

      await generationsDB.del(requestId);


      console.log(`Processed request ${requestId}`);
    } catch (e) {
      console.log("CAUGHT ERROR");

    }


  }
}