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
  KEY_GATEWAY_ADDRESS,
  keyGatewayABI,
  FarcasterNetwork,
  getSSLHubRpcClient,
  makeCastAdd,
} from '@farcaster/hub-nodejs';
import { ed25519 } from "@noble/curves/ed25519";

import {
  createPublicClient, createWalletClient, http,
  toHex,
  zeroAddress,
  fromHex,
  publicActions,
} from 'viem';
import { privateKeyToAccount, toAccount, mnemonicToAccount } from 'viem/accounts';
import { optimism } from 'viem/chains';

const APP_PRIVATE_KEY = `0x${process.env.DEPLOYER_WALLET_PRIVATE_KEY}`;
const FC_NETWORK = FarcasterNetwork.MAINNET; // Network of the Hub


let SIGNER_PRIVATE_KEY = process.env.MESSAGE_SIGNER_PRIVATE_KEY;


const OP_RPC_URL = process.env.OP_RPC_URL;
const fid = parseInt(process.env.FARCASTER_DEVELOPER_FID);

console.log(fid);



const publicClient = createPublicClient({
  chain: optimism,
  transport: http(OP_RPC_URL),
});

const MNEMONIC = process.env.SIGNER_MNEMONIC;

const account = mnemonicToAccount(MNEMONIC);

const walletClient = createWalletClient({
  account,
  chain: optimism,
  transport: http(OP_RPC_URL),
}).extend(publicActions);

const app = privateKeyToAccount(APP_PRIVATE_KEY);


const CHAIN = optimism;


const KeyContract = { abi: keyGatewayABI, address: KEY_GATEWAY_ADDRESS, chain: CHAIN };

const hubRpcEndpoint = 'hub-grpc.pinata.cloud';
const hubClient = getSSLHubRpcClient(hubRpcEndpoint);

// Start functions defintiions 

export async function getFidFromUsername(username) {
  const dataRes = await axios.get(`https://fnames.farcaster.xyz/transfers/current?name=${username}`);
  const data = dataRes.data;
  console.log(data);
  return data;
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

  console.log("Generate metadata");
  console.log(fid);

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


export async function makeCastFromDeveloperAccount(castData) {

  try {



    console.log(fid);


    const dataOptions = {
      fid: fid,
      network: FC_NETWORK,
    };

    const signerPrivateKey = await getOrRegisterSigner(fid);




    const signer = new NobleEd25519Signer(signerPrivateKey);



    console.log(dataOptions);
    console.log(signer);


    const submitPublicationCast = await makeCastAdd(
      {
        text: castData.text,
        embeds: [{ url: castData.url }],
        embedsDeprecated: [],
        mentions: [],
        mentionsPositions: [],
      },
      dataOptions,
      signer,
    );
      console.log(submitPublicationCast);



      const cast = submitPublicationCast._unsafeUnwrap();


      const messageResponse = await hubClient.submitMessage(cast);

      console.log(messageResponse);


    return submitPublicationCast;

  } catch (e) {
    console.log(e);
    return {};

  }


}


export async function removeCastFromDeveloperAccount(castData) {



}