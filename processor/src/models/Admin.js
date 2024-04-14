import { getUsersDB, getGenerationsDB, getSessionsDB, getPublicationsDB } from '../storage/Documents.js';
import { getSignersForUser } from '../utils/PinataUtils.js';
import { createEthSignSchema } from './Attestation.js';

export async function deleteAllRows() {
  // Implement the deleteAllRows function here
  const usersDB = await getUsersDB();
  const generationsDB = await getGenerationsDB();
  const sessionsDB = await getSessionsDB();
  const productsDB = await getPublicationsDB();

  const userList = await usersDB.all();
  for (const user of userList) {
    const userId = user.value._id;
    console.log(`Deleting user ${userId}`);
    await usersDB.del(userId);
  }
  console.log("All users deleted");

  const generationList = await generationsDB.all();
  for (const generation of generationList) {
    const generationId = generation.value._id;
    console.log(`Deleting generation ${generationId}`);
    await generationsDB.del(generationId);
  }
  console.log("All generations deleted");

  const sessionList = await sessionsDB.all();
  for (const session of sessionList) {
    const sessionId = session.value._id;
    console.log(`Deleting session ${sessionId}`);
    await sessionsDB.del(sessionId);
  }
  console.log("All sessions deleted");

  const productList = await getPublicationsDB.all();
  for (const product of productList) {
    const productId = product.value._id;
    console.log(`Deleting product ${productId}`);
    await getPublicationsDB.del(productId);
  }
  console.log("All rows deleted");

}

export async function updateSigners(fid) {
  fid = parseInt(fid);
  const signers = await getSignersForUser(fid);
  console.log(signers);

}


export async function createAttestationSignerSchema() {
  const resData = await createEthSignSchema();
  console.log(resData);
  return  resData;
}