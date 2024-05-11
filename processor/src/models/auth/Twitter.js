
import { TwitterApi } from 'twitter-api-v2';
import Auth from '../../schema/Auth.js';
import User from '../../schema/User.js';
import { generateAuthToken } from '../Auth.js';


const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET;

const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_KEY;

const CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;

const client = new TwitterApi({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET });

const CALLBACK_URL = `https://4b7f-49-49-10-122.ngrok-free.app/users/twitter_login_callback`;

export async function getTwitterLogin() {

 const { url, codeVerifier, state } = client.generateOAuth2AuthLink(CALLBACK_URL, { scope: ['tweet.read', 'users.read', 'offline.access', ] });

 console.log(codeVerifier);
 console.log(state);

  const auth = new Auth({ codeVerifier, state });
  await auth.save();
  return url;

}

export async function loginTwitterClient(payload) {
  const { state, code } = payload;
  const auth = await Auth.findOne({ state });
  const { codeVerifier } = auth;
  const responseData = await client.loginWithOAuth2({ code, codeVerifier, redirectUri: CALLBACK_URL });
  console.log(responseData);

  const authenticatedClient = responseData.client;
  const { accessToken, refreshToken } = responseData;


  console.log(accessToken, refreshToken);

  const userDataPayload = await authenticatedClient.v2.me({ 'user.fields': ['id', 'name', 'username', 'created_at', 'profile_image_url']});
  
  const userData = userDataPayload.data;
  const userExists = await User.findOne({ twitterId: userData.id });

  let userResponse;

  if (userExists) {
    userResponse = Object.assign({}, userExists._doc);
  
  } else {
    const user = new User({ twitterId: userData.id, pfpUrl: userData.profile_image_url,
       username: userData.username,
       displayName: userData.username, });
       userResponse = await user.save({

    });
  }

  const authToken = generateAuthToken(userResponse._id);

  return authToken;


}