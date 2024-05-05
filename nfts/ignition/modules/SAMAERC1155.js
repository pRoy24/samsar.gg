const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI = 1_000_000_000n;

module.exports = buildModule("SAMERC1155Module", (m) => {

  const erc1155Module = m.contract("SAMERC1155", ["0x86D7B423FBb589aeE159B481424526fdF55f795B", "0x33ee741b0FFF3C02AA392BC50F4184A44D3C710d"],
    {}
  );

  return { erc1155Module };
});
