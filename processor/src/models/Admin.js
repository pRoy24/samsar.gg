import { getUsersDB, getGenerationsDB, getSessionsDB, getProductsDB } from '../storage/Documents.js';

export async function deleteAllRows() {
  // Implement the deleteAllRows function here
  const usersDB = await getUsersDB();
  const generationsDB = await getGenerationsDB();
  const sessionsDB = await getSessionsDB();
  const productsDB = await getProductsDB();

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

  const productList = await productsDB.all();
  for (const product of productList) {
    const productId = product.value._id;
    console.log(`Deleting product ${productId}`);
    await productsDB.del(productId);
  }



  console.log("All rows deleted");


}