import express from 'express';
import { setUserData, getUserData, createSponsoredSigner, pollSignerForUser, verifyUserSession ,
  verifyUserToken
} from '../models/User.js';

const router = express.Router();

router.post('/verify', async (req, res) => {
  try {
    const payload = req.body;
    const userData = await verifyUserSession(payload);
    res.send(userData);
  } catch (e) {
    res.status(400).send({ e });
  }
});

router.get('/verify_token', async (req, res) => {
  try {
  const authToken = req.query.authToken;
  const userData = await verifyUserToken({ authToken });
  res.send(userData);
  } catch (e) {
    res.status(400).send({ e });
  }
});

router.post('/set_user', async (req, res) => {
  try {
    const payload = req.body;
    const session = await setUserData(payload);

    res.send(session);
  } catch (e) {
    console.log(e);
    res.send({});
  }
});


router.get('/profile', async (req, res) => {
  const fid = req.query.fid;
  const session = await getUserData(fid);
  res.send(session);
});

router.post('/attestation', async (req, res) => {
  const payload = req.body;
  const attestation = await generateAttestationForUser(payload);
  res.send(attestation);
});


router.post('/create_signer', async (req, res) => {
  const payload = req.body;
  const signerData = await createSponsoredSigner(payload);
  res.json(signerData);
});


router.post('/poll_signer', async (req, res) => {
  const payload = req.body;
  const responseData = await pollSignerForUser(payload);
  res.json(responseData);
});



// You can add more session-related routes here

export default router;
