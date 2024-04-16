
import express from 'express';
import { getChainList } from '../models/Utility.js';
import { getPinnedTemplatesList  } from '../utils/IPFSUtils.js';


const router = express.Router();


router.get('/chain_list', async function(req, res) {
  const chainList =  getChainList();
  res.json(chainList);
});


router.get('/template_list', async function(req, res) {
  const templateURLList = await getPinnedTemplatesList();
  res.json(templateURLList);
});


// You can add more session-related routes here

export default router;
