import { WitnessClient } from "@witnessco/client";
 import ('dotenv/config');
import {
  SignProtocolClient,
  SpMode,
  EvmChains,
  OffChainSignType,
} from '@ethsign/sp-sdk';
import { privateKeyToAccount } from 'viem/accounts';
const privateKey = process.env.ATTESTATION_SIGNER_PRIVATE_KEY; // optional



// Instantiate a new client, default params should suffice for now.
const witness = new WitnessClient();


const ethSignClient = new SignProtocolClient(SpMode.OffChain, {
  signType: OffChainSignType.EvmEip712,
  account: privateKeyToAccount(privateKey), // optional
});

export async function generateWitnessForFile(imageFile) {
  const leafHash = witness.hash(imageFile);
  // Post the leafHash to the server.
  await witness.postLeaf(leafHash);

  // Wait for the data to be included in an onchain checkpoint.
  // await witness.waitForCheckpointedLeafHash(leafHash);
  return leafHash;
}

export async function createEthSignSchema() {

  const attestationSchema = {
    name: 'Samsara creators attestation v1',
    data: [{
      name: 'signerAddress',
      type: 'address',
    }, {
      name: 'signerId',
      type: 'string',
    }, {
      name: 'attestationType',
      type: 'string',
    }, {
      name: 'publicationId',
      type: 'string',
    }, {
      name: 'witness0',
      type: 'string',
    }, {
      name: 'witness1',
      type: 'string',
    }, {
      name: 'witness2',
      type: 'string',
    }, {
      name: 'witness3',
      type: 'string',
    }, {
      name: 'witness4',
      type: 'string',
    }, {
      name: 'witness5',
      type: 'string',
    }, {
      name: 'witness6',
      type: 'string',
    }, {
      name: 'witness7',
      type: 'string',
    }, {
      name: 'witness8',
      type: 'string',
    }, {
      name: 'witness9',
      type: 'string',
    }],
  };


  const resData = await ethSignClient.createSchema(attestationSchema);

  return resData;

}

export async function createEthSignAttestation(payload) {
  const schemaId = process.env.ATTESTATION_SCHEMA_ID;


  payload = {
      'signerAddress': '0x0',
      'signerId': '0x0',
      'attestationType': '0x0',
      'publicationId': '0x0',
      'witness0': '0x0',
      'witness1': '0x0',
      'witness2': '0x0',
      'witness3': '0x0',
      'witness4': '0x0',
      'witness5': '0x0',
      'witness6': '0x0',
      'witness7': '0x0',
      'witness8': '0x0',
      'witness9': '0x0'

    }

console.log(payload);

  const attestationInfo = await ethSignClient.createAttestation({
    schemaId: schemaId, 
    data: payload,
    indexingValue: '0x0',
  });

  console.log(attestationInfo);
  console.log("MEMEMEM");
  return attestationInfo;



}
