import { PinataFDK } from "pinata-fdk";

const PINATA_JWT = process.env.PINATA_JWT;
const DEVELOPER_FID = process.env.FARCASTER_DEVELOPER_FID;

const fdk = new PinataFDK({
    pinata_jwt: PINATA_JWT,
    appFid: DEVELOPER_FID
});

export async function validateMessage(reqBody) {
    if (!reqBody) {
        return { isValid: false, message: 'Invalid message' };
    }
    const validateResponse = await fdk.validateFrameMessage(reqBody);
    return validateResponse;
}

export async function getFarcasterAccountAddress(fid) {
    const addressResponse = await fdk.getEthAddressForFid(fid);
    return addressResponse;
}


export function getPinataClient() {
    return fdk;
}