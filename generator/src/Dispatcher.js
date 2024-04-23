import { IMAGE_GENERAITON_MODEL_TYPES, IMAGE_EDIT_MODEL_TYPES } from './constants.js';
import axios from 'axios';
import path from 'path';
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

  const { prompt, model, image, maskImage } = payload;

  const pwd = process.cwd();

  const IMAGE_BASE_URL = `${process.env.API_SERVER}/temp/`;
  const imageURL = `${IMAGE_BASE_URL}${image}`;
  const maskImageURL = `${IMAGE_BASE_URL}${maskImage}`;


  if (model === IMAGE_EDIT_MODEL_TYPES.SDXL) {
    const requestPayload = {
      prompt,
      imageURL: imageURL,
      maskImageURL: 'https://raw.githubusercontent.com/CompVis/latent-diffusion/main/data/inpainting_examples/overture-creations-5sI6fQgYIuo_mask.png'
    }
    console.log(requestPayload);


    const response = await getEditedImageFromWebModel(requestPayload);
    return response;

  } else if (model === IMAGE_EDIT_MODEL_TYPES.DALLE2) {

  }

}

async function getImageFromWebModel(prompt) {
  const response = await axios.post(`${IMAGE_PROCESSOR_SERVER}/generate`, {
    prompt
  });
  const imageData = response.data.image;
  const imageName = await saveGeneratedFile(imageData);
  return imageName;
}


async function getEditedImageFromWebModel(payload) {
  const response = await axios.post(`${IMAGE_PROCESSOR_SERVER}/edit`, payload);
  const imageData = response.data.image;
  const imageName = await saveGeneratedFile(imageData);
  return imageName;
}