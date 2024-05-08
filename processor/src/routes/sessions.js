
import express from 'express';
import { requestGenerateImage, createNewSession, getSessionGenerationStatus, publishSession,
  saveIntermediate, getSessionDetails, publishSessionAndSetURI,
  requestOutpaintImage, getOrCreateSession} from '../models/Session.js';
import { verifyUserAuth } from '../models/Auth.js';


const router = express.Router();

router.post('/create', async function(req, res) {
  const payload = req.body;
  const sessionData = await createNewSession(payload);
  res.json(sessionData);
});

router.post('/request_generate', async function(req, res) {
  const payload = req.body;
  const sessionData = await requestGenerateImage(payload);
  res.json(sessionData);
});

router.post('/request_outpaint', async function(req, res) {
  const payload = req.body;
  const sessionData = await requestOutpaintImage(payload);
  res.json(sessionData);
});

router.get('/generate_status', async function(req, res) {
  const sessionId = req.query.id;
  const sessionData = await getSessionGenerationStatus(sessionId);
  res.json(sessionData);
});


router.post('/publish', async function(req, res) {
  const payload = req.body;
  const sessionData = await publishSession(payload);
  res.json(sessionData);
});

router.post('/publish_and_set_uri', async function(req, res) {
  const headers = req.headers;
  const userId = verifyUserAuth(headers);
   if (!userId) {
    res.status(401).send("Unauthorized");
    return;
  }
  const payload = req.body;
  const sessionData = await publishSessionAndSetURI(userId, payload);
  res.json(sessionData);
});

router.post('/save_intermediate', async function(req, res) {
  const payload = req.body;
  const sessionData = await saveIntermediate(payload);
  res.json(sessionData);

});

router.get('/details', async function(req, res) {
  const sessionId = req.query.id;
  const sessionData = await getSessionDetails(sessionId);
  res.json(sessionData);
});

router.post('/create_attestation', async function(req, res) {
  const payload = req.body;

  res.send("Not implemented");
});

router.post('/get_or_create_session', async function(req, res) {
  const payload = req.body;
  const sessionData = await getOrCreateSession(payload);
  res.json(sessionData);
});


// You can add more session-related routes here

export default router;
