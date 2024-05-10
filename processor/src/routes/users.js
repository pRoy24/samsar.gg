import express from 'express';
import {
  setUserData, getUserData, createSponsoredSigner, pollSignerForUser, verifyUserSession,
  verifyUserToken
} from '../models/User.js';
import { TwitterApi } from 'twitter-api-v2';

import ('dotenv/config');

const API_SERVER = process.env.API_SERVER;


const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET;

const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_KEY;

const twitterClient = new TwitterApi(TWITTER_BEARER_TOKEN);

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
  const CALLBACK_URL = `${API_SERVER}/users/twitter_login_callback`;
  const { url, codeVerifier, state } = await twitterClient.generateOAuth2AuthLink(CALLBACK_URL, { scope: ['tweet.read', 'users.read', 'offline.access'] });
  res.json(response);
});

router.get('/twitter_login_callback', async (req, res) => {
  const { state, code } = req.query;

  if (state !== req.session.state) {
    return res.status(403).send('State mismatch');
  }

  try {
    const { client: loggedClient, accessToken, refreshToken } = await twitterClient.loginWithOAuth2({
      code,
      codeVerifier: req.session.codeVerifier,
      redirectUri: CALLBACK_URL,
    });

    const userInfo = await loggedClient.v2.me();

    console.log(userInfo);


    // Create JWT
  //  const token = jwt.sign({ id: userInfo.data.id }, 'your_jwt_secret', { expiresIn: '1h' });

    //res.json({ token, userInfo: userInfo.data });
  } catch (error) {
    res.status(500).send(error);
  }

});

// You can add more session-related routes here

export default router;
