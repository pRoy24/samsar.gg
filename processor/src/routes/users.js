import express from 'express';
import { setUserData, getUserData } from '../models/User.js';

const router = express.Router();


router.post('/set_user', async (req, res) => {
  console.log("SETTING USER");

  try {
    const payload = req.body;
    console.log(payload);

    const session = await setUserData(payload);

    res.send(session);
  } catch (e) {
    console.log(e);
    res.send({});
  }
});


router.get('/profile', async (req, res) => {
  console.log("GETTING USER");
  
  const fid = req.query.fid;
  const session = await getUserData(fid);
  res.send(session);
});

router.post('/attestation', async (req, res) => {
  console.log("GETTING ATTESTATION");

  const payload = req.body;
  const attestation = await generateAttestationForUser(payload);
  res.send(attestation);
});



// You can add more session-related routes here

export default router;
