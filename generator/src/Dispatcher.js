import { IMAGE_GENERAITON_MODEL_TYPES, IMAGE_EDIT_MODEL_TYPES } from './constants.js';
import axios from 'axios';
import { saveGeneratedFile } from './Files.js';

const IMAGE_PROCESSOR_SERVER = process.env.IMAGE_PROCESSOR_SERVER;


export async function getImageFromText(payload) {
  const { prompt, model } = payload;
  if (model === IMAGE_GENERAITON_MODEL_TYPES['SDXL']) {
    const imageURL = await getImageFromWebModel(prompt);
    return imageURL;
  } else if (model === IMAGE_GENERAITON_MODEL_TYPES['DALLE3']) {
    console.log("DALLE3");
  }
}

export async function getOutpaintImageFromText(payload) {
  console.log("OUTPAINTING IMAGE");
  console.log(payload);
  const { prompt, imageURL, maskImageURL, model } = payload;
  if (model === IMAGE_EDIT_MODEL_TYPES.SDXL) {
    const response = await axios.post(`${IMAGE_PROCESSOR_SERVER}/edit`, {
      prompt,
      imageURL,
      maskImageURL
    });

  } else if (model === IMAGE_EDIT_MODEL_TYPES.DALLE2) {

  }

}

async function getImageFromWebModel(prompt) {
  const response = await axios.post(`${IMAGE_PROCESSOR_SERVER}/generate`, {
    prompt
  });

  const imageData = response.data.image;
  console.log(imageData);
  const imageName = await saveGeneratedFile(imageData);

  console.log(imageName);
  return imageName;

}