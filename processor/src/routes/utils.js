
import express from 'express';
import { getChainList } from '../models/Utility.js';

const router = express.Router();


router.get('/chain_list', async function(req, res) {
  const chainList =  getChainList();
  res.json(chainList);
});



// You can add more session-related routes here

export default router;
