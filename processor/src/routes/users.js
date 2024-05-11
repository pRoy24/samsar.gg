import express from 'express';
import {
  setUserData, getUserData, createSponsoredSigner, pollSignerForUser, verifyUserSession,
  verifyUserToken, addCustodyAddress
} from '../models/User.js';
import { verifyUserAuth } from '../models/Auth.js';

import { getTwitterLogin, loginTwitterClient } from '../models/auth/Twitter.js';


import ('dotenv/config');

const CLIENT_APP = process.env.CLIENT_APP;
const API_SERVER = process.env.API_SERVER;


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

router.get('/twitter_login', async (req, res) => {
  const loginUrl = await getTwitterLogin();
  console.log(loginUrl);

  res.json({ loginUrl });
});

router.get('/twitter_login_callback', async (req, res) => {
  const authToken = await loginTwitterClient(req.query);
  res.redirect(`${CLIENT_APP}/verify?authToken=${authToken}`)

});


router.post('/add_custody_address', async (req, res) => {
  const payload = req.body;
  const headers = req.headers;

  const userId = verifyUserAuth(req.headers);
  if (!userId) {
    res.status(401).send("Unauthorized");
    return;
  }
  const response = await addCustodyAddress(userId, payload);
  res.json(response);
});

// You can add more session-related routes here

export default router;
