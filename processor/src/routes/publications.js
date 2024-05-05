
import express from 'express';
import { getPublicationsList, getPublicationMeta,
  getTokenChainData
 } from '../models/Publication.js';

const router = express.Router();

router.get('/list', async function(req, res) {
  const publicationsList = await getPublicationsList();
  res.json(publicationsList);
});

router.get('/get_meta', async function(req, res) {
  const publicationId = req.query.id;
  const publicationsMeta = await getPublicationMeta(publicationId);

  res.json(publicationsMeta);
});



router.get('/token_info', async function(req, res) {
  const tokenId = req.query.id;
  const publicationsMeta = await getTokenChainData(tokenId);

  res.json(publicationsMeta);
});

export default router;
