require("@nomicfoundation/hardhat-toolbox");

require('dotenv').config();


let accounts = { mnemonic: process.env.SIGNER_MNEMONIC }

const ARBI_KEY = process.env.ARBISCAN_API_KEY;
const BLOCKSCOUT_API_KEY = process.env.BLOCKSCOUT_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  //2) select the default network "gnosis" or "chiado"
  defaultNetwork: "gnosis",
  networks: {
    hardhat: {
    },
    gnosis: {
      url: "https://rpc.gnosischain.com",
      accounts: accounts,
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      gasPrice: 1000000000,
      accounts: accounts,
    },
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      accounts: accounts,
    },
    arbitrum_sepolia: {
      url: "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: accounts,
    },
    base_sepolia: {
      url: "https://sepolia.base.org",
      accounts: accounts,
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: accounts,
    }
  },
  etherscan: {
    customChains: [
      {
        network: "chiado",
        chainId: 10200,
        urls: {
          apiURL: "https://blockscout.com/gnosis/chiado/api",
          browserURL: "https://blockscout.com/gnosis/chiado",
        },
      },
      {
        network: "gnosis",
        chainId: 100,
        urls: {
          apiURL: "https://api.gnosisscan.io/api",
          browserURL: "https://gnosisscan.io/",
        },
      },
      {
        network: "arbitrum_sepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io",
        },
      },
      {
        network: "arbitrum",
        chainId: 42161,
        urls: {
          apiURL: "https://api.arbiscan.io/api",
          browserURL: "https://arbiscan.io",
        },
      },
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
          apiURL: "https://api.arbiscan.io/api",
          browserURL: "https://sepolia-explorer.base.org",
        },
      }
    ],
    apiKey: {
      //4) Insert your Gnosisscan API key
      //blockscout explorer verification does not require keys
      chiado: BLOCKSCOUT_API_KEY,
      gnosis: BLOCKSCOUT_API_KEY,
      arbitrum: ARBI_KEY,
      arbitrum_sepolia: ARBI_KEY,
    },
  }
};


