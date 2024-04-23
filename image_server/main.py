from flask import Flask, request, jsonify
from PIL import Image
from diffusers import AutoPipelineForInpainting, DiffusionPipeline
from diffusers.utils import load_image
import torch

torch.cuda.empty_cache() 


app = Flask(__name__)

# Load models (this may vary depending on how you're handling model loading)
device = "cuda" if torch.cuda.is_available() else "cpu"

generator = DiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-xl-base-1.0", torch_dtype=torch.float16, use_safetensors=True, variant="fp16").to("cuda")

# inpainter = AutoPipelineForInpainting.from_pretrained("diffusers/stable-diffusion-xl-1.0-inpainting-0.1", torch_dtype=torch.float16, variant="fp16").to("cuda")


@app.route("/generate", methods=["POST"])
def generate_image():
    print("GENERATING")
    content = request.json
    prompt = content.get('prompt')
    print(prompt)
    images = generator(prompt=prompt).images[0]
    return jsonify({'image': images[0]})



if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=3021)
