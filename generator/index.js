import { resolve } from 'path';
import { processPendingImageRequests } from './src/Image.js';
import { createReplicas } from './src/db.js';

export async function listenToGenerationRequests() {
  await createReplicas();

    await getTimeout(10000);

    while (true) {
      console.log("Waiting for records");
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
