import psdk from '@pinata/sdk';
const pinataSDK = psdk;
import 'dotenv/config';
import axios from 'axios';

const PINATA_JWT = process.env.PINATA_JWT;


const pinata = new pinataSDK({ pinataJWTKey: PINATA_JWT});

export async function getPinnedTemplatesList() {

  try {
    const filters = {
      metadata: {
        keyvalues: {
          "file_type": {
            value: "meme_template_image",
            op: "eq"
        }
      }
    },
    pageLimit: 50,
  }

    const fileList = await pinata.pinList(filters)
    return fileList.rows;
  } catch (e) {

    console.log(e);

  }

}
