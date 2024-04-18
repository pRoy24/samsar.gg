import {
  FarcasterNetwork,
  getAuthMetadata,
  getInsecureHubRpcClient,
  getSSLHubRpcClient,
  HubAsyncResult,
  makeUserDataAdd,
  Message,
  Metadata,
  NobleEd25519Signer,
  UserDataType,
  ID_GATEWAY_ADDRESS,
  idGatewayABI,
  KEY_GATEWAY_ADDRESS,
  keyGatewayABI,
  ID_REGISTRY_ADDRESS,
  idRegistryABI,
  ViemLocalEip712Signer,
  makeCastRemove,
} from "@farcaster/hub-nodejs";
import { mnemonicToAccount, toAccount } from "viem/accounts";
import {
  createWalletClient,
  decodeEventLog,
  fromHex,
  Hex,
  http,
  LocalAccount,
  publicActions,
  toHex,
  zeroAddress,
} from "viem";
import { optimism } from "viem/chains";
import { ed25519 } from "@noble/curves/ed25519";
import axios from "axios";



export async function updateFarcasterProfileDetails(fid) {
  
}