
import { Schema,model } from 'mongoose';
// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema({
  fid: String,
  userId: String,

  bio: String,
  custody: String,

  displayName: String,
  message: String,
  nonce: String,
  pfpUrl: String,
  signature: String,
  state: String,
  username: String,
  verifications: Array,
  twitterId: String,

}, { timestamps: true });

// 3. Create a Model.
const User = model('User', userSchema);

export default User;
