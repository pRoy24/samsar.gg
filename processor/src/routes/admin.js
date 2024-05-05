
import express from 'express';
import { deleteAllRows, updateSigners, createAttestationSignerSchema } from '../models/Admin.js';
import { createSchema } from '../models/Signature.js';
import 'dotenv/config';

const router = express.Router();


router.get('/delete_all_rows', async function (req, res) {
  const secret = req.query.secret;
  if (secret !== process.env.ADMIN_SECRET) {
    res.status(401).send('Unauthorized');
    return;
  } else {
    const payload = req.body;
    const sessionData = await deleteAllRows();
    res.json(sessionData);
  }
});


// You can add more session-related routes here

export default router;
