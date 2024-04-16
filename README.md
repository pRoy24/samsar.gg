## SAMSAR.GG

## Open-source AI enabled image-editor with tokenized incentives and on-chain verifiability of original-content.

## This repository contains the following 7 projects -

1. client: Client is a typescript React app implementation of image editor over konva.js
2. processor: NodeJS express server which exposes several routes for CRUD processing as-well as runs an OrbitDB replica for storage.
3. generator: A javascript listener which listens to image generation/outpaint requests and routes them to the image processor.
4. publisher: NextJS project which contains the pages and API routes for frames as well as the landing page.
5. nfts: This is solidity hardhat project which contains the custom ERC1155 contracts used to NFT operations.
6. db_master: This is the master orbit db process which runs all the dbs. Currently does not implement authentication. Be sure to only configure localhost if running the server locally.
7. farcaster_utils: Contains some utility functions to manage farcaster and pinata sdks.


### More details coming soon.

* This is a pre-alpha testnet only release. Please do not send any funds to any of the contracts.