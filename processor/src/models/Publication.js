import { getPublicationsDB } from "../storage/Documents.js";
import { getDBConnectionString } from "./DBString.js";
import Publication from "../schema/Publication.js";
import { getTokenSupply , getContractMeta} from "./Contract.js";

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