
import { getSignersForUser } from '../utils/PinataUtils.js';
import { createEthSignSchema } from './Attestation.js';
import { getDBConnectionString } from './DBString.js';
import { byteIndexOf ,truncateTo320Bytes } from '../utils/StringUtils.js';

import Session from '../schema/Session.js';
import Publication from '../schema/Publication.js';
import { makeCastFromDeveloperAccount, removeCastFromDeveloperAccount } from '../utils/FarcasterHub.js';
import User from '../schema/User.js';
import Generation from '../schema/Generation.js';
import { getCastsForDeveloperAccount } from '../utils/PinataUtils.js';


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

export async function makeCastFromAccount(reqBody) {


  console.log(reqBody);
  

  let { text, url } = reqBody;
  text = truncateTo320Bytes(text);
  const mentionsPosition = byteIndexOf(text, "\n");

  const castPayload = {
    text,
    embeds: [{url: url}],
    mentions: [],
    embedsDeprecated: [],
    mentionsPositions: []
  }

  console.log(castPayload);


  await makeCastFromDeveloperAccount(castPayload);

}

export async function deleteCastsFromAccount(hash) {

  const castData = await getCastsForDeveloperAccount();

  for (let i = 0; i < castData.length; i++) {

    console.log(castData[i]);

    const hexString = castData[i].hash.slice(2);

    const byteArray = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < byteArray.length; i++) {
        // Convert each pair of hex characters to a byte
        byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16);
    }


    const castPayload = {
      hash: byteArray
    };

    await removeCastFromDeveloperAccount(castPayload);
    
  }
  
  const castPayload = {
    hash
  };

 // await removeCastFromDeveloperAccount(castPayload);
}