import { getUsersDB } from '../storage/Documents.js';

import { createFarcasterSigner, pollSignerForCompletion, getUserExtradata } from '../utils/PinataUtils.js';
import { generateAttesterPrivateKey } from '../utils/ViemUtils.js';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

const FARCASTER_DEVELOPER_FID = process.env.FARCASTER_DEVELOPER_FID;
const PINATA_JWT = process.env.PINATA_JWT;

export async function setUserData(payload) {

  // This function should return a session object
  const db = await getUsersDB();
  const fid = payload.fid.toString();
  if (!payload._id) {
    payload._id = fid;
  }
  const userExistsData = await db.get(fid);

  if (!userExistsData) {
    payload.attesterPrivateKey = generateAttesterPrivateKey();
    await db.put(userInit);
    return userInit;
  } else {
    const userExistsDataValue = userExistsData.value;
    if (!userExistsDataValue.attesterPrivateKey) {
      userExistsDataValue.attesterPrivateKey = generateAttesterPrivateKey();
    }
    const newUserData = { ...userExistsDataValue, ...payload, };
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
    let userDataValue = userData.value;

    return userDataValue;
  }

}

export async function generateAttestationForUser(payload) {
  console.log("GENERATING ATTESTATION");

}


export async function getSignerForFid(fid) {

}

export async function createSponsoredSigner(payload) {

  const appFid = FARCASTER_DEVELOPER_FID;
  const userFid = payload.fid.toString();

  try {

    const signerData = await createFarcasterSigner();
    const {token, signer_id} = signerData;
    const userData = await getUserData(userFid);
    userData.faracsterTransactionToken = token;
    userData.farcasterSignerId = signer_id;
    userData.farcasterSignupStatus = "PENDING";
    await setUserData(userData);
    return signerData;
  } catch (e) {
    console.error(e);
    return null;
  }
}



export async function loginOrCreateUserAndSigner() {
  const appFid = FARCASTER_DEVELOPER_FID;
  const db = await getUsersDB();
  const userExistsData = await db.get(appFid);

  if (!userExistsData) {
    console.log("user not found adding");
    const newUser = {
      _id: appFid,
      fid: appFid,
      app_fid: appFid,
      type: "app",
      signer_id: null
    }
    await db.put(newUser);
    return newUser;
  } else {
    return userExistsData;
  }

}

export async function pollSignerForUser(payload) {
  const userFid = payload.fid.toString();
  const userData = await getUserData(userFid);
  const signerId = userData.farcasterSignerId;
  const token = userData.faracsterTransactionToken;
  const signerData = await pollSignerForCompletion(token);
  console.log(signerData);
  if (signerData && signerData.state === "completed") {
    userData.farcasterSignupStatus = "COMPLETED";
    await setUserData(userData);
  }
  return signerData;
}