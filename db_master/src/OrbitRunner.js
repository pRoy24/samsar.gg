import { createOrbitDB, Identities, OrbitDBAccessController } from '@orbitdb/core'
import { createHelia } from 'helia'

import { createLibp2p } from 'libp2p'
import { identify } from '@libp2p/identify'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { bitswap } from '@helia/block-brokers'
import { tcp } from '@libp2p/tcp'
import { mdns } from '@libp2p/mdns'
import { LevelBlockstore } from 'blockstore-level'

let orbitdb;
let usersDB;
let sessionsDB;
let generationsDB;

export async function getUsersDocumentAddress() {
  if (usersDB) {
    return new Promise((resolve) => (resolve(usersDB)));
  } else {
    const orbitdb = await getDBLib();
    const userDBInstance = await orbitdb.open("samsar_users",
      {
        type: 'documents',
        AccessController: OrbitDBAccessController({ write: ["*"], sync: false }),
      })



    usersDB = userDBInstance.address;
    return usersDB;
  }
}

export async function getSessionsDocumentAddress() {
  if (sessionsDB) {
    return new Promise((resolve) => (resolve(sessionsDB)));
  } else {
    const orbitdb = await getDBLib();
    const sessionDBInstance = await orbitdb.open("samsar_sessions",
      {
        type: 'documents',
        AccessController: OrbitDBAccessController({ write: ["*"], sync: false }),
      })

    sessionsDB = sessionDBInstance.address;
    return sessionsDB;

  }
}


export async function getGenerationsDocumentAddress() {
  if (generationsDB) {
    return new Promise((resolve) => (resolve(generationsDB)));
  } else {
    const orbitdb = await getDBLib();
    const sessionDBInstance = await orbitdb.open("samsar_generations",
      {
        type: 'documents',
        AccessController: OrbitDBAccessController({ write: ["*"], sync: false }),
      })

    generationsDB = sessionDBInstance.address;
    return generationsDB;

  }
}





async function getDBLib(index = 0) {

  if (orbitdb) {
    return orbitdb;
  } else {

    const ipAddress = "127.0.0.1"


    const ipfsLibp2pOptions = {
      transports: [
        tcp(),
      ],
      streamMuxers: [
        yamux()
      ],
      connectionEncryption: [
        noise()
      ],
      peerDiscovery: [
        mdns({
          interval: 20e3
        })
      ],
      services: {
        pubsub: gossipsub({
          // neccessary to run a single peer
          allowPublishToZeroPeers: true
        }),
        identify: identify()
      },
      connectionManager: {
      }
    }


    const libp2p = await createLibp2p({
      addresses: {
        listen: [`/ip4/${ipAddress}/tcp/0`]
      }, ...ipfsLibp2pOptions
    })
    const blockstore = new LevelBlockstore(`./ipfs/1_${index}/blocks`)
    const ipfs = await createHelia({ blockstore: blockstore, libp2p: libp2p, blockBrokers: [bitswap()] })

    const identities = await Identities({ ipfs, path: `./orbitdb/1_${index}/identities` })
    const id = "1"
    const identity = identities.createIdentity({ id })


    orbitdb = await createOrbitDB({ ipfs: ipfs, identities, id: `1`, directory: `./orbitdb/1_${index}` })

    return orbitdb;
  }
}



async function handleTerminationSignal() {
  console.info('received termination signal, cleaning up and exiting...');
  await usersDB.close()
  await orbitdb.stop()
  await ipfs.stop()
  process.exit();
}
