
import express from 'express';
import { deleteAllRows} from '../models/Admin.js';
import { createSchema } from '../models/Signature.js';


const router = express.Router();


router.get('/delete_all_rows', async function(req, res) {
  const payload = req.body;
  const sessionData = await deleteAllRows();
  res.json(sessionData);
});


router.post('/create_ethsign_schema', async function(req, res) {
  const payload = req.body;
  console.log("Creating schema");
  console.log(payload);
  await createSchema(payload);

  res.send({});


});

// You can add more session-related routes here

export default router;
