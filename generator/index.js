// import { EventEmitter } from 'events';
// EventEmitter.defaultMaxListeners = 100;

import { processPendingImageRequests } from './src/Image.js';


export async function listenToGenerationRequests() {


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
