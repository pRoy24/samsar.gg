import express from 'express';
import {getFidFromUsername, createDeveloperAccount , viewAccountDetails, updateUsername} from '../models/User.js';
import { uploadTemplateFolder } from '../models/Pinata.js';

const router = express.Router();

router.get('/fid_by_username', async (req, res) => {
  try {
    const username = req.query.username;
    const data = await getFidFromUsername(username);
    res.send(data);
  } catch (e) {
    console.log(e);
    res.send({});
  }
});

router.post('/create_account', async function(req, res) {
  try {
    const data = await createDeveloperAccount();
    console.log(data);  
    res.send(data);
  } catch (e) {


  }
});


router.get('/view_account_details', async function(req, res) {
  try {
    const fid = req.query.fid;
    const data = await viewAccountDetails(fid);
    res.send(data);
  } catch (e) {
    res.send({});

  }
});

router.post('/update_username', async function(req, res) {
  try {
    const fid = req.body.fid;
    const username = req.body.username;
    const data = await updateUsername(fid, username);
    res.send(data);
  } catch (e) {
    res.send({});
  }
});


router.get('/upload_templates', async function(req, res) {
  try {
    console.log("uploading temTTTpaltes");
    await uploadTemplateFolder();
    res.send({status: 'success'});
  } catch (e) {

  }
});



// You can add more session-related routes here

export default router;


