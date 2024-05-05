

export const CHAIN_DEFINITIONS = [
  {
    name: 'Base Sepolia (Testnet)',
    key: 'base_sepolia',
    id: 84532,
    rpc: "https://sepolia.base.org",
    blockExplorer: "https://sepolia-explorer.base.org",
  },
  {
    name: 'Base (Mainnet)',
    key: 'base',
    id: 8453,
    rpc: "https://mainnet.base.org",
    blockExplorer: "https://basescan.org",
  }
  
]


export const erc1155ContractAddress = process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESS;

const CURRENT_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

export const CHAIN = CHAIN_DEFINITIONS.find(chain => chain.id === parseInt(CURRENT_CHAIN_ID));