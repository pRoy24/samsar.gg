import psdk from '@pinata/sdk';
const pinataSDK = psdk;
import 'dotenv/config';
import axios from 'axios';

const PINATA_JWT = process.env.PINATA_JWT;


const pinata = new pinataSDK({ pinataJWTKey: PINATA_JWT});

export async function getPinnedTemplatesList() {

  console.log("GETTIN ITEM LIST");

  try {

    const filters = {
      metadata: {
        keyvalues: {
          "file_type": {
            value: "meme_template_image",
            op: "eq"
        }
      }
    }
  }

    console.log(filters);



    const fileList = await pinata.pinList(filters)

    console.log(fileList);
    return fileList.rows;


  } catch (e) {

    console.log(e);

  }

}
