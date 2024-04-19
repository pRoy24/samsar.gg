import { HeartBitCore } from "@fileverse/heartbit-core";

const coreSDK = new HeartBitCore({
  chain: "0xaa36a7",
});

export async function mintHeartBeat(payload) {

  await coreSDK.unSignedMintHeartBit({
    message,
    signature,
    startTime,
    endTime,
    hash,
  });


}

export async function getHeartBeats(hash) {

}