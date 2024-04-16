import fs from 'fs/promises';
import standardFS from 'fs';
import path from 'path';
import 'dotenv/config';
import pkg from '@pinata/sdk';
console.log(pkg);
console.log("EEE");
const pinataSDK = pkg;



const PINATA_JWT = process.env.PINATA_JWT;
const pinata = new pinataSDK({ pinataJWTKey: PINATA_JWT });


export async function uploadTemplateFolder() {
  console.log("EEERRR");
  const pwd = process.cwd();
  console.log(pwd);
  try {
    const folderPath = `${pwd}/src/assets/templates/`;

    console.log(folderPath);

    await normalizeFileNamesAndUpload(folderPath);


  } catch (e) {

  }
}


export async function normalizeFileNamesAndUpload(directory) {
  try {
    console.log(directory);
    console.log("EE MME");
    // Read the directory contents
    const files = await fs.readdir(directory);

    console.log(files);


    for (const file of files) {
      console.log(file);

      const filePath = path.join(directory, file);

      // Check if it's a file and not a directory
      const stats = await fs.stat(filePath);
      if (stats.isFile()) {
        // Split the filename into words, remove the extension first
        const ext = path.extname(file);
        const baseName = path.basename(file, ext);

        const cleanedName = baseName.replace(/_/g, ' ').replace(/\s+/g, ' ');

        const words = baseName.split(/\s+/).slice(0, 6).join('_');

        // New filename with the same extension
        const newFileName = `${words}${ext}`;
  
        const pinataOptions = {
          pinataMetadata: {
              name: newFileName,
              keyvalues: {
                  'keywords': cleanedName,
                  'file_type': 'meme_template_image'
              }
          },
          pinataOptions: {
              cidVersion: 0
          }
      };

      console.log(pinataOptions);

      const readableStreamForFile = standardFS.createReadStream(filePath);

      const res = await pinata.pinFileToIPFS(readableStreamForFile, pinataOptions)
      console.log(res)
      console.log("GOIN TO NEXT");






      }
    }
  } catch (error) {
    console.error('Error processing files:', error);
  }
}
