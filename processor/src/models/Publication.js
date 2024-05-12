import { getDBConnectionString } from "./DBString.js";
import User from "../schema/User.js";
import Publication from "../schema/Publication.js";
import path from 'path';
import fs from 'fs';
import { getTokenSupply , getContractMeta, getCreatorAllocation, refundTokensToUser} from "./Contract.js";
import { getOffchainBurnPrice } from "../utils/TokenUtils.js";

const API_SERVER = process.env.API_SERVER;
const IPFS_BASE = process.env.IPFS_BASE;

export async function getPublicationsList() {
  try {

    await getDBConnectionString();
    const publications = await Publication.find({}).limit(10);
    return publications;
  } catch (error) {
  }
}

export async function getPublicationMeta(tokenId) {
  try {
    await getDBConnectionString();
    const publication = await Publication.findOne({ slug: tokenId });
    const publicationId = publication._id.toString();
    const pwd = process.cwd();
    
    const publicationOGImage = path.join(pwd, 'assets/twitter', `${publicationId}.png`);
  
    console.log("OG IMAG " + publicationOGImage);

    let payloadResponse = Object.assign({}, publication._doc);
    

    if (fs.existsSync(publicationOGImage)) {
      const imageURL = `${API_SERVER}/twitter/${publicationId}.png`;
      payloadResponse.twitterOGImage = imageURL;
    } else {
      payloadResponse.twitterOGImage =  `${IPFS_BASE}${publication.imageHash}`;
    }
    getContractMetaAndSave(publicationId);
    return payloadResponse;
  } catch (error) {
    console.log(error);

  }
}

export async function getTokenChainData(tokenId) {
  try {
    const tokenMeta = await getContractMeta(tokenId);
    return tokenMeta;

  } catch (error) {

  }

}

async function getContractMetaAndSave(tokenId) {
  try {
    await getDBConnectionString();
    const tokenMeta = await getContractMeta(tokenId);

    const publication = await Publication.findOne({ tokenId: tokenId });
    publication.maxSupply = tokenMeta.maxSupply;
    publication.currentSupply = tokenMeta.currentSupply;
    publication.creatorMintAmount = tokenMeta.creatorMintAmount;
    publication.mintPrice = tokenMeta.mintPrice;
    publication.save();
    
  } catch (error) {
  }
}

export async function getPublicationsListByUser(userId) {
  try {
    await getDBConnectionString();
    const publications = await Publication.find({ createdBy: userId }).limit(10);
    return publications;
  } catch (error) {
  }
}

export async function getPublicationDataForUser(userId, tokenId) {
  try {
    await getDBConnectionString();
    const publication = await Publication.findOne({ createdBy: userId, tokenId: tokenId });
    return publication;
  } catch (error) {
  }
}

export async function burnCreatorTokens(userId, payload) {

  try {
    await getDBConnectionString();
    const publication = await Publication.findOne({ createdBy: userId, tokenId: payload.tokenId });

    const userData = await User.findOne({ _id: userId });
    const tokenId = payload.tokenId;

    const tokenSupply = await getTokenSupply(tokenId);
    const creatorAllocation = await getCreatorAllocation(tokenId);
    const burnAmount = payload.burnAmount;

    const burnRequestPayload = {
      totalSupply: BigInt(tokenSupply),
      creatorAllocation: BigInt(creatorAllocation),
      burnAmount: BigInt(payload.burnAmount)
    }

    const burnRefund = getOffchainBurnPrice(burnRequestPayload);

    const { refundAmount, adminFees } = burnRefund;

 
    const refundUserPayload = {
      tokenId: tokenId,
      amount: burnAmount,
      minter: userData.custody,
      returnAmount: refundAmount.toString(),
      adminFee: adminFees.toString()
    };
    await refundTokensToUser(refundUserPayload);

    if (tokenSupply > 0) {
      return;
    }

 

    return publication;
  } catch (error) {
  }
}