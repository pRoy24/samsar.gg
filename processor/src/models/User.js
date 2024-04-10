import { getUsersDB } from '../storage/Documents.js';
import { v4 as uuidv4 } from 'uuid';


export async function setUserData(payload) {
  console.log("SETTING USER");
  console.log(payload);
  

  // This function should return a session object
  const db = await getUsersDB();
  const fid = payload.fid.toString();
  if (!payload._id) {
    payload._id = fid;
  }
  const userExistsData = await db.get({ _id: fid });

  if (!userExistsData) {
    console.log("user not found adding");
    await db.put(payload);

    return payload;
  } else {
    const newUserData = { ...userExistsData, ...payload };
    await db.put(newUserData);
    return newUserData;
  }
}

export async function getUserData(fid) {

  fid = fid.toString();

  const db = await getUsersDB();

  const userData = await db.get(fid);
  // This function should return a session object
  if (userData && userData.value) {
    return userData.value;
  }

}

export async function generateAttestationForUser(payload) {
  console.log("GENERATING ATTESTATION");

}