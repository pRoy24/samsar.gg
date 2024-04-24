import { Schema,model } from 'mongoose';

// 2. Create a Schema corresponding to the document interface.
const generationSchema = new Schema({

  outpaintStatus: String,
  sessionId: String,
  image: String,
  maskImage: String,
  rowLocked: Boolean,
  operationType: String,
  prompt: String,
  model: String,
  generationStatus: String,

}, { timestamps: true });

// 3. Create a Model.
 const Generation = model('Generation', generationSchema);
export default Generation;





