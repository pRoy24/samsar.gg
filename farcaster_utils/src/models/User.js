import * as ed from '@noble/ed25519';
import 'dotenv/config';
import axios from 'axios';

import {
  ID_GATEWAY_ADDRESS,
  ID_REGISTRY_ADDRESS,
  ViemLocalEip712Signer,
  idGatewayABI,
  idRegistryABI,
  NobleEd25519Signer,
  BUNDLER_ADDRESS,
  bundlerABI,
  KEY_GATEWAY_ADDRESS,
  keyGatewayABI,
  makeUserNameProofClaim,
} from '@farcaster/hub-nodejs';

import { bytesToHex, createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount, toAccount, mnemonicToAccount } from 'viem/accounts';
import { optimism } from 'viem/chains';

const APP_PRIVATE_KEY = process.env.APP_PRIVATE_KEY;
const APP_PUBLIC_KEY = process.env.APP_PUBLIC_KEY;

const ALICE_PRIVATE_KEY = '0x00';

let SIGNER_PRIVATE_KEY = ALICE_PRIVATE_KEY;

const OP_RPC_URL = process.env.OP_RPC_URL;

const accountName = 'samsar';


const publicClient = createPublicClient({
  chain: optimism,
  transport: http(OP_RPC_URL),
});

const walletClient = createWalletClient({
  chain: optimism,
  transport: http(OP_RPC_URL),
});



const app = privateKeyToAccount(APP_PRIVATE_KEY);
const appAccountKey = new ViemLocalEip712Signer(app);



const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // set the signatures' deadline to 1 hour from now

const WARPCAST_RECOVERY_PROXY = '0x00000000FcB080a4D6c39a9354dA9EB9bC104cd7';



// Start functions defintiions 

export async function getFidFromUsername(username) {
  const dataRes = await axios.get(`https://fnames.farcaster.xyz/transfers/current?name=${username}`);
  const data = dataRes.data;
  console.log(data);
  return data;
}

export async function createDeveloperAccount() {
  const price = await publicClient.readContract({
    address: ID_GATEWAY_ADDRESS,
    abi: idGatewayABI,
    functionName: 'price',
    args: [0n],
  });

  console.log("Simulating contract");
  const { request } = await publicClient.simulateContract({
    account: app,
    address: ID_GATEWAY_ADDRESS,
    abi: idGatewayABI,
    functionName: 'register',
    args: [WARPCAST_RECOVERY_PROXY, 0n],
    value: price,
  });
  await walletClient.writeContract(request);

  console.log("Creating APP ID");
  const APP_FID = await publicClient.readContract({
    address: ID_REGISTRY_ADDRESS,
    abi: idRegistryABI,
    functionName: 'idOf',
    args: [app.address],
  });
  console.log(APP_FID);

  console.log("Adding user name");
  const accountNameChanged = await addNameToAccount(accountName);


  return APP_FID;

}

export async function addNameToAccount(fid, accountName) {

    try {
      // First check if this fid already has an fname
      const response = await axios.get(`https://fnames.farcaster.xyz/transfers/current?fid=${fid}`);
      const fname = response.data.transfer.username;
      console.log(`Fid ${fid} already has fname: ${fname}`);
      return fname;
    } catch (e) {
      // No username, ignore and continue with registering
    }
  
    const fname = accountName;
    const timestamp = Math.floor(Date.now() / 1000);

    const claim = makeUserNameProofClaim({
      name: fname,
      owner: app.address,
      timestamp: Math.floor(Date.now() / 1000),
    });


    let signature = (
      await appAccountKey.signUserNameProofClaim(claim)
    )._unsafeUnwrap();

    signature = bytesToHex(signature);
    fid = parseInt(fid);

    try {
      const response = await axios.post("https://fnames.farcaster.xyz/transfers", {
        name: fname, // Name to register
        from: 0, // Fid to transfer from (0 for a new registration)
        to: fid, // Fid to transfer to (0 to unregister)
        fid: fid, // Fid making the request (must match from or to)
        owner: app.address, // Custody address of fid making the request
        timestamp: timestamp, // Current timestamp in seconds
        signature: signature, // EIP-712 signature signed by the current custody address of the fid
      });
      return fname;
    } catch (e) {
      // @ts-ignore
      throw new Error(`Error registering fname: ${JSON.stringify(e.response.data)} (status: ${e.response.status})`);
    }
  
  
}

export async function addWalletToUser() {

  const alice = privateKeyToAccount(ALICE_PRIVATE_KEY);
  const aliceAccountKey = new ViemLocalEip712Signer(alice);

  /*******************************************************************************
   * Collect Register signature from Alice
   *******************************************************************************/

  let nonce = await publicClient.readContract({
    address: KEY_GATEWAY_ADDRESS,
    abi: keyGatewayABI,
    functionName: 'nonces',
    args: [alice.address],
  });

  const registerSignatureResult = await aliceAccountKey.signRegister({
    to: alice.address,
    recovery: WARPCAST_RECOVERY_PROXY,
    nonce,
    deadline,
  });

  let registerSignature;
  if (registerSignatureResult.isOk()) {
    registerSignature = registerSignatureResult.value;
  } else {
    throw new Error('Failed to generate register signature');
  }

  const privateKeyBytes = ed.utils.randomPrivateKey();
  const accountKey = new NobleEd25519Signer(privateKeyBytes);

  let accountPubKey = new Uint8Array();
  const accountKeyResult = await accountKey.getSignerKey();
  if (accountKeyResult.isOk()) {
    accountPubKey = accountKeyResult.value;

    const signedKeyRequestMetadata =
      await appAccountKey.getSignedKeyRequestMetadata({
        requestFid: APP_FID,
        key: accountPubKey,
        deadline,
      });

    if (signedKeyRequestMetadata.isOk()) {
      const metadata = bytesToHex(signedKeyRequestMetadata.value);

      nonce = await publicClient.readContract({
        address: KEY_GATEWAY_ADDRESS,
        abi: keyGatewayABI,
        functionName: 'nonces',
        args: [alice.address],
      });

      const addSignatureResult = await aliceAccountKey.signAdd({
        owner: alice.address,
        keyType: 1,
        key: accountPubKey,
        metadataType: 1,
        metadata,
        nonce,
        deadline,
      });

      if (addSignatureResult.isOk()) {
        const addSignature = addSignatureResult.value;

        const price = await publicClient.readContract({
          address: BUNDLER_ADDRESS,
          abi: bundlerABI,
          functionName: 'price',
          args: [0n],
        });

        const { request } = await publicClient.simulateContract({
          account: app,
          address: BUNDLER_ADDRESS,
          abi: bundlerABI,
          functionName: 'register',
          args: [
            {
              to: alice.address,
              recovery: WARPCAST_RECOVERY_PROXY,
              sig: bytesToHex(registerSignature),
              deadline,
            },
            [
              {
                keyType: 1,
                key: bytesToHex(accountPubKey),
                metadataType: 1,
                metadata: metadata,
                sig: bytesToHex(addSignature),
                deadline,
              },
            ],
            0n,
          ],
          value: price,
        });
        await walletClient.writeContract(request);
      }
    }
  }

}

export async function viewAccountDetails(fid) {
  try {
    const pinataApiHeaders = {
      'headers': {
        'Authorization': 'Bearer ' + process.env.PINATA_JWT,
      }
    }
    const res = await axios.get(`https://api.pinata.cloud/v3/farcaster/users/${fid}`, pinataApiHeaders);
    console.log(res);

    const data = res.data;
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
    return {};
  }
}

export async function getOrRegisterSigner(fid) {

  if (SIGNER_PRIVATE_KEY !== zeroAddress) {
    // If a private key is provided, we assume the signer is already in the key registry
    const privateKeyBytes = fromHex(SIGNER_PRIVATE_KEY, "bytes");
    const publicKeyBytes = ed25519.getPublicKey(privateKeyBytes);
    console.log(`Using existing signer with public key: ${toHex(publicKeyBytes)}`);
    return privateKeyBytes;
  }

  const privateKey = ed25519.utils.randomPrivateKey();
  const publicKey = toHex(ed25519.getPublicKey(privateKey));

  console.log(`Created new signer for test with private key: ${toHex(privateKey)}`);

  // To add a key, we need to sign the metadata with the fid of the app we're adding the key on behalf of
  // We'll use our own fid and custody address for simplicity. This can also be a separate App specific fid.

  const eip712signer = new ViemLocalEip712Signer(app);
  const metadata = await eip712signer.getSignedKeyRequestMetadata({
    requestFid: BigInt(fid),
    key: fromHex(publicKey, "bytes"),
    deadline: BigInt(Math.floor(Date.now() / 1000) + 60 * 60), // 1 hour from now
  });

  const metadataHex = toHex(metadata.unwrapOr(new Uint8Array()));

  const { request: signerAddRequest } = await walletClient.simulateContract({
    ...KeyContract,
    functionName: "add",
    args: [1, publicKey, 1, metadataHex], // keyType, publicKey, metadataType, metadata
  });

  const signerAddTxHash = await walletClient.writeContract(signerAddRequest);
  console.log(`Waiting for signer add tx to confirm: ${signerAddTxHash}`);


  await walletClient.waitForTransactionReceipt({ hash: signerAddTxHash });
  console.log(`Registered new signer with public key: ${publicKey}`);
  console.log("Sleeping 30 seconds to allow hubs to pick up the signer tx");
  await new Promise((resolve) => setTimeout(resolve, 30000));
  return privateKey;



}

export async function updateUsername(fid, username) {
  try {

    await addNameToAccount(fid, username);

  } catch (e) {
    console.log(e);
    return {};
  }
}