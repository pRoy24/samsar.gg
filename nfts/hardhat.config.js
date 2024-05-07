require("@nomicfoundation/hardhat-toolbox");

require('dotenv').config();



let accounts = { mnemonic: process.env.SIGNER_MNEMONIC }

const ARBI_KEY = process.env.ARBISCAN_API_KEY;
const BLOCKSCOUT_API_KEY = process.env.BLOCKSCOUT_API_KEY;
const BASE_KEY = process.env.BASE_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",

  networks: {
    hardhat: {
   
  
    },
    base_sepolia: {
      url: "https://sepolia.base.org",
      accounts: accounts,
      chainId: 84532,
      gasPrice: 50000000000,
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: accounts,
    }
  },
  etherscan: {
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
      {
        network: "base_sepolia",
        chainId: 84532,
        urls: {
          browserURL: "https://sepolia-explorer.base.org",
        },
      }
    ],
    apiKey: {
      base: BASE_KEY,
    },
  }
};


