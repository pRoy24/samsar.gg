import psdk from '@pinata/sdk';
const pinataSDK = psdk;
import 'dotenv/config';
import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';

const PINATA_JWT = process.env.PINATA_JWT;


const pinata = new pinataSDK({ pinataJWTKey: PINATA_JWT});

export async function getPinnedTemplatesList(pageNumber) {
  const numItemsPerPage = 100;
  const pwd = process.cwd();
  const folderPath = path.join(pwd, 'assets/templates/mm_final'); // Adjust the path as necessary

  try {
    // Read the directory
    const files = await fs.readdir(folderPath);
    // Calculate the offset
    const startIndex = (pageNumber - 1) * numItemsPerPage;
    // Slice the file array to get only the items for the current page
    const pageFiles = files.slice(startIndex, startIndex + numItemsPerPage);
    return pageFiles;

  } catch (error) {

  }
}


