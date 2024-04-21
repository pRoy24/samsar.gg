import { getPublicationsDB } from "../storage/Documents.js";

export async function getPublicationsList() {
  try {
  const db = await getPublicationsDB();
  const productsList = await db.all();
  if (productsList && productsList.length > 0) {
    return productsList.map((product) => product.value);
  }
  } catch (error) {
  }
}

export async function getPublicationMeta(publicationId) {
  try {
  const db = await getPublicationsDB();
  const publication = await db.get(publicationId);
  const publicationValue = publication.value;
  console.log(publicationValue);
  return publicationValue;
  } catch (error) {
  }
}