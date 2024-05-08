import { PinataFDK } from "pinata-fdk";
import 'dotenv/config';
import axios from 'axios';

const APP_FID = process.env.FARCASTER_DEVELOPER_FID;
const PINATA_JWT = process.env.PINATA_JWT;
const MNEMONIC = process.env.FARCASTER_DEVELOPER_MNEMONIC;

const fdk = new PinataFDK({
  pinata_jwt: `${PINATA_JWT}`,
  pinata_gateway: "",
  app_fid: `${APP_FID}`,
  appMnemonic: MNEMONIC
})

export async function getSignersForUser(fid) {
  const pollData = await fdk.getSigners(fid) 
  return pollData;
}


export async function createFarcasterSigner() {
  const signerData = await fdk.createSigner();
  return signerData;
}

export async function pollSignerForCompletion(token) {
  const pollData = await fdk.pollSigner(token);  
  return pollData; 
}

export async function getUserExtradata(fid) {
  const headers = {
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`
    }
  }
  const resData = await axios.get(`https://api.pinata.cloud/v3/farcaster/users/${fid}`, headers);
  const response = resData.data;
  return response;
}

export async function getCastsForDeveloperAccount() {
  const developerFid = process.env.FARCASTER_DEVELOPER_FID;
  const headers = {
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`
    }
  
  }
  const dataRes = await axios.get(`https://api.pinata.cloud/v3/farcaster/casts?fid=${developerFid}`, headers);

  const data = dataRes.data;
  return data.data.casts;
}

export  async function removeCastFromDeveloperAccount(hash) {
  const headers = {
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`
    }
  }

  const resData = await axios.delete(`https://api.pinata.cloud/v3/farcaster/casts/${hash}`, headers);
  const response = resData.data;
  console.log(response);


}