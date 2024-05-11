
import { createThirdwebClient } from "thirdweb";
import {
  createWallet,
  walletConnect,
} from "thirdweb/wallets";

import { createAuth } from "thirdweb/auth";


const THIRDWEB_ID = process.env.REACT_APP_THIRDWEB_ID;
const DOMAIN = process.env.REACT_APP_CLIENT_URL;
const CHAIN_ID = process.env.REACT_APP_SELECTED_CHAIN;

export const client = createThirdwebClient({
  clientId: THIRDWEB_ID
});

export const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  walletConnect(),
];



export function getAuth() {
  const auth = createAuth({
    domain: DOMAIN,
    client,
  });
  return auth;

   
}

const thirdwebAuth = getAuth();

export async function getAuthPayload(address) {
  const payload = await thirdwebAuth.generatePayload({
    address,
    chainId: CHAIN_ID
  });
  return payload;
}

export async function verifyAuthPayload(params) {
  const verifiedPayload = await thirdwebAuth.verifyPayload(params);

  return verifiedPayload;
}