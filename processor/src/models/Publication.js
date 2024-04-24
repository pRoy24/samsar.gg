import { getPublicationsDB } from "../storage/Documents.js";
import { getDBConnectionString } from "./DBString.js";
import Publication from "../schema/Publication.js";

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
    const publication = await Publication.findOne({ _id: publicationId });
    return publication;
  } catch (error) {
  }
}