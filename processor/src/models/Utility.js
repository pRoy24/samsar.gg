import { CHAIN_DEFINITIONS } from '../consts/Chains.js';

export function getChainList() {
  return CHAIN_DEFINITIONS;
}


export function getChainByKey(chainKey) {
  return CHAIN_DEFINITIONS.find((chain) => chain.key === chainKey);
}


