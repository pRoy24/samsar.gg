import { getPublicationsDB } from "../storage/Documents.js";
import { getDBConnectionString } from "./DBString.js";
import User from "../schema/User.js";
import Publication from "../schema/Publication.js";
import { getTokenSupply , getContractMeta, getCreatorAllocation, refundTokensToUser} from "./Contract.js";
import { getOffchainBurnPrice } from "../utils/TokenUtils.js";

export async function getPublicationsList() {
  try {

    await getDBConnectionString();
    const publications = await Publication.find({}).limit(10);
    return publications;
  } catch (error) {
  }
}

export async function getPublicationMeta(publicationId) {
  try {
    await getDBConnectionString();
    const publication = await Publication.findOne({ slug: publicationId });

    getContractMetaAndSave(publicationId);

    return publication;
  } catch (error) {
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