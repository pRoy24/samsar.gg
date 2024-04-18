import 'dotenv/config';
import * as fs from 'fs';
import OpenAI from "openai";



import path from "path";
import { mkdir, writeFile } from "fs/promises";


const API_KEY = process.env.OPENAI_API_KEY;


const openai = new OpenAI({apiKey: API_KEY });

export async function getImageFromText(prompt) {


  try {


    const image = await openai.images.generate({ model: "dall-e-3", prompt: prompt, response_format: 'b64_json' });

    const imageData = image.data[0]['b64_json'];

    const randStr = Math.random().toString(36).substring(7);
    const imageName = `generation_${Date.now()}_${randStr}.png`


    // Decode base64 to binary data
    const buffer = Buffer.from(imageData, 'base64');


    const pwd = process.cwd();

    const savePath = path.join(pwd, '..', 'processor', 'assets', 'generations', imageName);

    // Ensure the directory exists
    await mkdir(path.dirname(savePath), { recursive: true });

    // Write the file to the filesystem
    await writeFile(savePath, buffer);
    return imageName;
  } catch (error) {
    console.log("LOGGING ERROR")

    console.log(error);
  }


}

export async function getOutpaintImageFromText(prompt, imageURL, maskImageURL) {
  console.log("GETTING OUTPAINT");
  console.log(prompt);
  console.log(imageURL);
  console.log(maskImageURL);
  console.log("******");

  try {
    const image = await openai.images.edit(
      {
        image: fs.createReadStream(imageURL),
        mask: fs.createReadStream(maskImageURL),
        prompt: prompt,
        response_format: 'b64_json'
      }
    );
    console.log(image);

    const imageData = image.data[0]['b64_json'];

    console.log("IMAGE DATA");
    console.log(imageData);

    const randStr = Math.random().toString(36).substring(7);
    const imageName = `outpaint_${Date.now()}_${randStr}.png`

    // Decode base64 to binary data
    const buffer = Buffer.from(imageData, 'base64');

    const pwd = process.cwd();

    const savePath = path.join(pwd, '..', 'processor', 'assets', 'generations', imageName);

    // Ensure the directory exists
    await mkdir(path.dirname(savePath), { recursive: true });

    // Write the file to the filesystem
    await writeFile(savePath, buffer);
    console.log(imageName);

    return imageName;

  } catch (error) {
    console.log(error);

  }
}