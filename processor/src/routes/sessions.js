
import express from 'express';
import { requestGenerateImage, createNewSession, getSessionGenerationStatus, publishSession,
  saveIntermediate, getSessionDetails, publishSessionAndSetURI,
  createAttestation} from '../models/Session.js';


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
  const payload = req.body;
  const sessionData = await publishSessionAndSetURI(payload);
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
  const sessionData = await createAttestation(payload);
  res.json(sessionData);

});


// You can add more session-related routes here

export default router;
