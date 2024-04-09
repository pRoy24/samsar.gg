import { resolve } from 'path';
import { processPendingImageRequests } from './src/Image.js';
import { createReplicas } from './src/db.js';

export async function listenToGenerationRequests() {
  await createReplicas();


    console.log("LOGGINGING LISTEN");

    await getTimeout(10000);

    while (true) {
      console.log("Processing");
      // await createReplicas();

      await processPendingImageRequests();
      await getTimeout(1000);
    }


  

}

async function getTimeout(timeout = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

listenToGenerationRequests();
