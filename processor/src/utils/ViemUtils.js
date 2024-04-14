
import { generatePrivateKey } from 'viem/accounts'
 


export function generateAttesterPrivateKey() {
  const privateKey = generatePrivateKey()
  return privateKey;

}