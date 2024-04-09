
import express from 'express';
import { deleteAllRows} from '../models/Admin.js';


const router = express.Router();


router.get('/delete_all_rows', async function(req, res) {
  const payload = req.body;
  const sessionData = await deleteAllRows();
  res.json(sessionData);
});




// You can add more session-related routes here

export default router;
