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

import 'dotenv/config'


const USERS_DB_URL = "samsar_users"
const SESSIONS_DB_URL = "samsar_sessions"
const GENERATIONS_DB_URL = "samsar_generations"
const PUBLICATIONS_DB_URL = "samsar_publications"

let usersDB;
let sessionsDB;
let generationdDB;
let publicationsDB;

let orbitdb;


process.on('SIGTERM', handleTerminationSignal);
process.on('SIGINT', handleTerminationSignal);
console.info('Script is running. Press CTRL+C to terminate.');


export async function getUsersDocument() {
  if (usersDB) {
    return usersDB;
  } else {
    const orbitdb = await getDBLib(0);
    const userDBInstance = await orbitdb.open(USERS_DB_URL,
      {
        type: 'documents',
        AccessController: OrbitDBAccessController({ write: ["*"], sync: false }),
      })
    usersDB = userDBInstance;
    console.log("USER ADDRESS", usersDB.address.toString());
    return usersDB;
  }
}

export async function getSessionsDocument() {
  if (sessionsDB) {
    return sessionsDB;
  } else {
    const orbitdb = await getDBLib(1);
    const sessionDBInstance = await orbitdb.open(SESSIONS_DB_URL,
      {
        type: 'documents',
        AccessController: OrbitDBAccessController({ write: ["*"], sync: false }),
      })

    sessionsDB = sessionDBInstance;
    console.log("SESSION ADDRESS", sessionsDB.address.toString());
    return sessionsDB;

  }
}

export async function getGenerationsDocument() {
  if (generationdDB) {
    return generationdDB;
  } else {
    const orbitdb = await getDBLib(2);
    const generationDBInstance = await orbitdb.open(GENERATIONS_DB_URL,
      {
        type: 'documents',
        AccessController: OrbitDBAccessController({ write: ["*"], sync: false }),
      })

    generationdDB = generationDBInstance;
    console.log("GENERATOR ADDRESS", generationdDB.address.toString());
    return generationdDB;

  }
}

export async function getPublicationsDocument() {
  if (publicationsDB) {
    return publicationsDB;
  } else {
    const orbitdb = await getDBLib(3);
    const publicationsDBInstance = await orbitdb.open(PUBLICATIONS_DB_URL,
      {
        type: 'documents',
        AccessController: OrbitDBAccessController({ write: ["*"], sync: false }),
      })
      publicationsDB = publicationsDBInstance;
    console.log("PUBLICATIONS ADDRESS", publicationsDB.address.toString());
    return publicationsDB;

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
  try {
    await usersDB.close()
  } catch (e) {

  }
  try {
    await sessionsDB.close()
  } catch (e) {

  }
  try {
    await generationdDB.close()
  } catch (e) {

  }
  try {
    await publicationsDB.close()
  } catch (e) {

  }

  try {
    await ipfs.stop()
  } catch (e) {

  }
  try {
    await orbitdb.stop()
  } catch (e) {

  }

  process.exit();

}