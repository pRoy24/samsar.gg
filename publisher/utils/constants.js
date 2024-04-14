import { createThirdwebClient } from "thirdweb"
import 'dotenv/config';

const THIRDWEB_SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;


export const client = createThirdwebClient({
  secretKey: THIRDWEB_SECRET_KEY,
});

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


export const erc1155ContractAddress = proces.env.CHAIDO_DEPLOYMENT_ADDRESS;

export const CHAIN = CHAIN_DEFINITIONS[0];