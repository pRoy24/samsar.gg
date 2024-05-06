
import jwt from 'jsonwebtoken';


export function generateAuthToken(userId) {
  const SECRET_KEY = process.env.TOKEN_SECRET;
  const token = jwt.sign({ _id: userId },
    SECRET_KEY,
    { expiresIn: 60 * 60 * 24 * 30 });
  return token;
}

export function verifyAuthToken(authToken) {
  const SECRET_KEY = process.env.TOKEN_SECRET;
  const decoded = jwt.verify(authToken, SECRET_KEY);
  return decoded;

}

export function verifyUserAuth(reqHeaders) {
  try {
    const SECRET_KEY = process.env.TOKEN_SECRET;
    const tokenString = reqHeaders.authorization;
    const token = tokenString.split("Bearer ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded._id;
  } catch (e) {

  }
}

export async function verifyUserAuthAndGetUser(reqHeaders) {

  const SECRET_KEY = process.env.TOKEN_SECRET;
  const tokenString = reqHeaders.authorization;
  if (!tokenString) throw new Error("No token provided");
  const token = tokenString.split("Bearer ")[1];
  const decoded = jwt.verify(token, SECRET_KEY);
  const userId = decoded._id;
  try {
    const UserModel = require('./User');
    const userData = await UserModel.getUserById(userId);
    return userData;
  } catch (e) {
    console.log("ERROR");
  }
}
