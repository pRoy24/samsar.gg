
import { getUsersDocument, getSessionsDocument, getGenerationsDocument, getProductsDocument } from './src/DBMasterRunner.js';

console.log("Running DB Master");

async function main() {
  await getUsersDocument();
  await getSessionsDocument();
  await getGenerationsDocument();
  await getProductsDocument();
}

main();