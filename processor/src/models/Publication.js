import { getPublicationsDB } from "../storage/Documents.js";

export async function getPublicationsList() {
  const db = await getPublicationsDB();
  const productsList = await db.all();
  return productsList.map((product) => product.value);
}

export async function getPublicationMeta(publicationId) {
  const db = await getPublicationsDB();
  const publication = await db.get(publicationId);
  const publicationValue = publication.value;
  console.log(publicationValue);
  return publicationValue;
}