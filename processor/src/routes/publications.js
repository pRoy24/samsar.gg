
import express from 'express';
import { getPublicationsList, getPublicationMeta,
  getTokenChainData,
  getPublicationsListByUser,
  getPublicationDataForUser,
  burnCreatorTokens,

 } from '../models/Publication.js';

 import { verifyUserAuth } from '../models/Auth.js';

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


router.get('/list_user_publications', async function(req, res) {
  console.log("LIST LIST");
  console.log(req.headers);

  const userId = verifyUserAuth(req.headers);
  if (!userId) {
    res.status(401).send("Unauthorized");
    return;
  }

  const publicationsList = await getPublicationsListByUser(userId);
  res.json(publicationsList);
});


router.get('/user_publication', async function(req, res) {

  const tokenId = req.query.tokenId;

  const userId = verifyUserAuth(req.headers);
  if (!userId) {
    res.status(401).send("Unauthorized");
    return;
  }

  const publicationsData = await getPublicationDataForUser(userId, tokenId);
  res.json(publicationsData);
});

router.post('/burn_creator', async function(req, res) {

  const payload = req.body;

  const userId = verifyUserAuth(req.headers);
  if (!userId) {
    res.status(401).send("Unauthorized");
    return;
  }

  const publicationsData = await burnCreatorTokens(userId, payload);
  res.json(publicationsData);
});

export default router;
