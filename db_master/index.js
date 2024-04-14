
import { getUsersDocument, getSessionsDocument, getGenerationsDocument, getPublicationsDocument } from './src/DBMasterRunner.js';

console.log("Running DB Master");

async function main() {
  await getUsersDocument();
  await getSessionsDocument();
  await getGenerationsDocument();
  await getPublicationsDocument();
}

main();