
import { getUsersDocument, getSessionsDocument, getGenerationsDocument } from './src/DBMasterRunner.js';

console.log("Running DB Master");

async function main() {
  await getUsersDocument();
  await getSessionsDocument();
  await getGenerationsDocument();
}

main();