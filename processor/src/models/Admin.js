
import { getSignersForUser } from '../utils/PinataUtils.js';
import { createEthSignSchema } from './Attestation.js';
import { getDBConnectionString } from './DBString.js';

import Session from '../schema/Session.js';
import Publication from '../schema/Publication.js';
import { makeCastFromDeveloperAccount, removeCastFromDeveloperAccount } from '../utils/FarcasterHub.js';
import User from '../schema/User.js';
import Generation from '../schema/Generation.js';

export async function deleteAllRows() {
  // Implement the deleteAllRows function here
 await getDBConnectionString();

  const sessionData = await Session.deleteMany({});
  const publicationData = await Publication.deleteMany({});
  const userData = await User.deleteMany({});
  const generationData = await Generation.deleteMany({});
  return {sessionData, publicationData, userData, generationData};

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

export async function makeCastFromAccount() {


  const castPayload = {
    text: 'YNH Firegoddess by @roy24x7 https://www.samsar.gg/p/0',
    url: 'https://www.samsar.gg/p/0'
  };

  await makeCastFromDeveloperAccount(castPayload);

}

export async function removeCastFromAccount() {
  console.log("REMOVING CAST FROM ACCOUNT");

  const castPayload = {

  };

  await removeCastFromDeveloperAccount(castPayload);
}