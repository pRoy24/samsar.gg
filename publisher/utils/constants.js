

export const CHAIN_DEFINITIONS = [
  {
    name: 'Gnosis Chaido (Testnet)',
    key: 'gnosis_chaido',
    id: 10200,
    rpc: "https://rpc.chiadochain.net",
    blockExplorer: "https://blockscout.com/gnosis/chiado"
  },
  {
    name: 'Arbitrum Sepolia (Testnet)',
    key: 'arbitrum_sepolia',
    id: 421614,
    rpc: "https://sepolia-rollup.arbitrum.io/rpc",
    blockExplorer: "https://sepolia.arbiscan.io",
  }
]


export const erc1155ContractAddress = process.env.CHAIDO_DEPLOYMENT_ADDRESS;

export const CHAIN = CHAIN_DEFINITIONS[0];