import { IMAGE_GENERAITON_MODEL_TYPES } from './constants.js';
import axios from 'axios';
const IMAGE_PROCESSOR_SERVER = process.env.IMAGE_PROCESSOR_SERVER;


export async function getImageFromText(payload) {
  console.log("GENERATING IMAGE");
  console.log(payload);
  console.log("EEMEME");
  const { prompt, model } = payload;
  if (model === IMAGE_GENERAITON_MODEL_TYPES['SDXL']) {
    console.log("SDXL");
    await getImageFromWebModel(prompt);
  } else if (model === IMAGE_GENERAITON_MODEL_TYPES['DALLE3']) {
    console.log("DALLE3");
  }
}

export async function getOutpaintImageFromText(payload) {
  console.log("OUTPAINTING IMAGE");
  console.log(payload);
}

async function getImageFromWebModel(prompt) {
  const response = await axios.post(`${IMAGE_PROCESSOR_SERVER}/generate`, {
    prompt
  });

}