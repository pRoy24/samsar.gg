const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

require('dotenv').config();

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI = 1_000_000_000n;

const DEPLOYER_WALLET_ADDRESS = process.env.DEPLOYER_WALLET_ADDRESS;
const ADMIN_WALLET_ADDRESS = process.env.ADMIN_WALLET_ADDRESS;


module.exports = buildModule("SAMERC1155Module", (m) => {

  const erc1155Module = m.contract("SAMERC1155", [DEPLOYER_WALLET_ADDRESS, ADMIN_WALLET_ADDRESS],
    {}
  );

  return { erc1155Module };
});
