from flask import Flask, request, jsonify
from PIL import Image
from diffusers import AutoPipelineForInpainting, DiffusionPipeline
from diffusers.utils import load_image
import torch
import io
from flask import send_file

torch.cuda.empty_cache() 


app = Flask(__name__)

# Load models (this may vary depending on how you're handling model loading)
device = "cuda" if torch.cuda.is_available() else "cpu"

generator = DiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-xl-base-1.0", torch_dtype=torch.float16, use_safetensors=True, variant="fp16").to("cuda")

inpainter = AutoPipelineForInpainting.from_pretrained("diffusers/stable-diffusion-xl-1.0-inpainting-0.1", torch_dtype=torch.float16, variant="fp16").to("cuda")


@app.route("/generate", methods=["POST"])
def generate_image():
    content = request.json
    prompt = content.get('prompt')
    image = generator(prompt=prompt).images[0]
    print(image)
    return {'image': image}

@app.route("/edit", methods=["POST"])
def edit_image():
  content = request.json
  image_url = content.get('image_url')
  mask_url = content.get('mask_url')
  prompt = content.get('prompt')

  image = load_image(image_url).resize((1024, 1024))
  mask_image = load_image(mask_url).resize((1024, 1024))

  generator = torch.Generator(device="cuda").manual_seed(0)
  
  image = inpainter(
    prompt=prompt,
    image=image,
    mask_image=mask_image,
    guidance_scale=8.0,
    num_inference_steps=20,  # steps between 15 and 30 work well for us
    strength=0.99,  # make sure to use `strength` below 1.0
    generator=generator,
  ).images[0]

  # Save the image to a BytesIO object
  img_io = io.BytesIO()
  image.save(img_io, 'PNG', quality=100)
  img_io.seek(0)

  print(img_io)

  print("I BNE HERE")
  
  # Send the buffer as a response
  return send_file(img_io, mimetype='image/jpeg')



if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=3021)
