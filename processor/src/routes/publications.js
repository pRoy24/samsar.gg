
import express from 'express';
import { getPublicationsList, getPublicationMeta } from '../models/Publication.js';


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





// You can add more session-related routes here

export default router;
