import { getProductsDB } from "../storage/Documents.js";

export async function getProductsList() {
  const db = await getProductsDB();
  const productsList = await db.all();
  return productsList.map((product) => product.value);
}

export async function getProductMeta(productId) {
  const db = await getProductsDB();
  const product = await db.get(productId);
  return product.value;
}