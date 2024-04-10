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
import minimist from 'minimist'
import 'dotenv/config'



const USERS_DB_URL = "samsar_users"
const SESSIONS_DB_URL = "samsar_sessions"
const GENERATIONS_DB_URL = "samsar_generations"
const PRODUCTS_DB_URL = "samsar_products"


let usersDB;
let generationsdDB;
let sessionsDB;

let orbitdb;

process.on('SIGTERM', handleTerminationSignal);
process.on('SIGINT', handleTerminationSignal);
console.info('Script is running. Press CTRL+C to terminate.');

export async function getUsersDB() {

  if (usersDB) {
    return new Promise((resolve) => (resolve(usersDB)));
  } else {
    const userDB = await runReplica(0);
    usersDB = userDB;
    return usersDB;
  }
}

export async function getGenerationsDB() {
  if (generationsdDB) {
    return new Promise((resolve) => (resolve(generationsdDB)));
  } else {
    const genDB = await runReplica(1);
    generationsdDB = genDB;
    return generationsdDB;

  }
}

export async function getSessionsDB() {
  if (sessionsDB) {
    return new Promise((resolve) => (resolve(sessionsDB)));
  } else {
    const sessionDB = await runReplica(2);
    sessionsDB = sessionDB;
    return sessionsDB;

  }
}


export async function runReplica(dbIndex) {
    console.log("running replica te" + dbIndex); 

    let  ipAddress = "127.0.0.1"
  
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

    let dbAddress;
    if (dbIndex === 0) {
      dbAddress = USERS_DB_URL
    } else if (dbIndex === 1) {
      dbAddress = SESSIONS_DB_URL
    } else if (dbIndex === 2) {
      dbAddress = GENERATIONS_DB_URL
    }

    const libp2p = await createLibp2p({
      addresses: {
        listen: [`/ip4/${ipAddress}/tcp/0`]
      }, ...ipfsLibp2pOptions
    })
    const blockstore = new LevelBlockstore(`./ipfs/2_${dbIndex}/blocks`)
    const ipfs = await createHelia({ blockstore: blockstore, libp2p: libp2p, blockBrokers: [bitswap()] })
    const identities = await Identities({ ipfs, path: `~/orbitdb/2_${dbIndex}/identities` })
    const id = "2"
    const identity = identities.createIdentity({ id })
  
    orbitdb = await createOrbitDB({ ipfs: ipfs, identities, id: `2`, directory: `~/orbitdb/2_${dbIndex}` })
  
    let db = await orbitdb.open(dbAddress,
      {
        type: 'documents',
        AccessController: OrbitDBAccessController({ write: ["*"], sync: false }),
      })
    let oldHeads = await db.log.heads()
    console.debug(`${new Date().toISOString()} initial heads ${JSON.stringify(Array.from(oldHeads, h => h.payload))}`)
    await new Promise(r => setTimeout(r, 5000));
    await db.close()
    console.debug(`${new Date().toISOString()} opening db for sync`)
  
    db = await orbitdb.open(dbAddress,
      {
        type: 'documents',
        AccessController: OrbitDBAccessController({ write: ["*"] }),
      })


    db.events.on('join', async (peerId, heads) => {
      for await (let entry of heads) {
        console.info(`peer ${peerId} joined with head ${JSON.stringify(entry.payload)}`)
      }
      if (oldHeads) {
        for (let hash of Array.from(oldHeads, h => h.hash)) {
          let it = db.log.iterator({ gt: hash })
          for await (let entry of it) {
            console.debug(`new startup entry ${JSON.stringify(entry.payload)}`)
            oldHeads = [entry]
          }
        }
      }
    })
    console.info(`${new Date().toISOString()}running with db address ${db.address}`)
  
    console.info(`${new Date().toISOString()} getting updates ...`)
    db.events.on('update', async (entry) => {
      console.debug(`new head entry op ${entry.payload.op} with value ${JSON.stringify(entry.payload.value)}`)
      if (oldHeads) {
        for (let hash of Array.from(oldHeads, h => h.hash)) {
          let it = db.log.iterator({ gt: hash, lte: entry.hash })
          for await (let entry of it) {
            console.debug(`new updated entry ${JSON.stringify(entry.payload)}`)
            oldHeads = [entry]
          }
        }
      } else {
        let it = db.log.iterator({ lte: entry.hash })
        for await (let entry of it) {
          console.debug(`new updated entry ${JSON.stringify(entry.payload)}`)
          oldHeads = [entry]
        }
      }
    })
    console.info(`${new Date().toISOString()} searching result: `)
    let result = await db.query(data => {
      return data.content === "content 5000"
    })
    console.info(`${new Date().toISOString()} result: `, JSON.stringify(result))
  
    if (dbIndex === 0) {
      usersDB = db;
      return usersDB;
    } else if (dbIndex === 1) {
      sessionsDB = db;
      return sessionsDB;
    } else if (dbIndex === 2) {
      generationsdDB = db;
      return generationsdDB;
    }

}

export async function createReplicas() {
  console.log("CREATING REPLICATES");

  await runReplica(1);
  await runReplica(2);
}

async function handleTerminationSignal() {
  console.info('received termination signal, cleaning up and exiting...');

  try {
    await generationdDB.close()
  } catch (e) {

  }
  try {
    await sessionsDB.close()
  } catch (e) {

  }
  try {
    await usersDB.close()
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
