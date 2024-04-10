import {
  SignProtocolClient,
  SpMode,
  EvmChains,
  OffChainSignType,
  OffChainRpc,
} from "@ethsign/sp-sdk";
import 'dotenv/config';
import { privateKeyToAccount } from "viem/accounts";

const privateKey = process.env.SIGNER_PRIVATE_KEY;

let client;
export async function getSignatureClient() {
  if (client) {
    return client;


  } else {
    const currClient = new SignProtocolClient(SpMode.OffChain, {
      signType: OffChainSignType.EvmEip712,
      rpcUrl: OffChainRpc.testnet,
      account: privateKeyToAccount(privateKey),
    });
    client = currClient;
    return client;
  }
}
export async function createSchema(payload) {
  const client = await getSignatureClient();

  console.log("GEEE");
  console.log(client);

  const res = await client.createSchema({
    name: payload.name,
    data: payload.data,
  });
  console.log("SCHEMA CREATED");
  console.log(res);
  return res;
}

export async function createAttestation(schemaId, payload) {
  console.log("GENERATING ATTESTATION");
  const res = await client.createAttestation({
    schemaId: schemaId,
    data: payload,
    indexingValue: "xxx",
  });

}