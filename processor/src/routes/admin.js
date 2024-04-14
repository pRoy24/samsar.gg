
import express from 'express';
import { deleteAllRows, updateSigners, createAttestationSignerSchema} from '../models/Admin.js';
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

router.get('/update_signers', async function(req, res) {
  const fid = req.query.fid;
  await updateSigners(fid);
  res.send({});
});


router.post('/create_ethsign_attestation', async function(req, res) {
  const payload = req.body;
  console.log("Creating attestation");
  await createAttestationSignerSchema();
  res.send({});

});

// You can add more session-related routes here

export default router;
