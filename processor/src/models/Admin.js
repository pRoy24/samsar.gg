
import { getSignersForUser } from '../utils/PinataUtils.js';
import { createEthSignSchema } from './Attestation.js';
import { getDBConnectionString } from './DBString.js';

import Session from '../schema/Session.js';
import Publication from '../schema/Publication.js';
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