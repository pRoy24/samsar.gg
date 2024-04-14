import { mnemonicToAccount } from "viem/accounts";

const PINATA_JWT = process.env.PINATA_JWT;

const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
  name: "Farcaster SignedKeyRequestValidator",
  version: "1",
  chainId: 10,
  verifyingContract: "0x00000000fc700472606ed4fa22623acf62c60553",
};

const SIGNED_KEY_REQUEST_TYPE = [
  { name: "requestFid", type: "uint256" },
  { name: "key", type: "bytes" },
  { name: "deadline", type: "uint256" },
];

const appFid = process.env.FARCASTER_DEVELOPER_FID;
const account = mnemonicToAccount(
  process.env.FARCASTER_DEVELOPER_MNEMONIC
);

async function createSigner() {
  const res = await fetch("https://api.pinata.cloud/v3/farcaster/signers", {
    method: "POST",
    headers: {
      'Content-Type': "application/json",
      "Authorization": `Bearer ${PINATA_JWT}`
    },
    body: JSON.stringify({
      app_fid: parseInt(appFid, 10)
    })
  });

  const signerInfo = await res.json();
  console.log(signerInfo)
  const { data } = signerInfo;
  return data;
}



export async function signRequestAndGenerate() {
  const signerData = await createSigner();

  const deadline = Math.floor(Date.now() / 1000) + 86400; // signature is valid for 1 day
  const requestFid = parseInt(appFid);
  const signature = await account.signTypedData({
    domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
    types: {
      SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
    },
    primaryType: "SignedKeyRequest",
    message: {
      requestFid: BigInt(appFid),
      key: `0x${signerData.public_key}`,
      deadline: BigInt(deadline),
    }
  });

  const registerResponse = await fetch(`https://api.pinata.cloud/v3/farcaster/register_signer_with_warpcast`, {
    method: "POST",
    headers: {
      'Content-Type': "application/json",
      "Authorization": `Bearer ${PINATA_JWT}`
    },
    body: JSON.stringify({
      signer_id: signerData.signer_uuid,
      signature: signature,
      deadline: deadline,
      app_fid: requestFid,
      app_address: account.address
    })
  })

  const warpcastPayload = await registerResponse.json()
  return warpcastPayload.data;
}

export async function getFarcasterSigners() {
  const res = await fetch(`https://api.pinata.cloud/v3/farcaster/signers`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${PINATA_JWT}`
    }
  });

  const signerInfo = await res.json();
  const { data } = signerInfo;
  return data;
}