## SAMSAR.GG

## Open-source AI enabled image-editor with tokenized incentives and on-chain verifiability of original-content.


Contract Addresses-
Currently the contracts have been deployed to the following two testnets-

* Testnet Integrations
1. Arbitrum Sepolia
0xB7d50B44c923FBd15614bf2b15602575f623BC72
https://sepolia.arbiscan.io/address/0xB7d50B44c923FBd15614bf2b15602575f623BC72#code


2. Gnosis Chaido 
0x1aC3f8F965310e3aa1E7f4D25909843DB04De90f
https://gnosis-chiado.blockscout.com/address/0x1aC3f8F965310e3aa1E7f4D25909843DB04De90f


* Mainnet integrations-
Comoing soon

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