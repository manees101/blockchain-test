require('dotenv').config();
require('@nomicfoundation/hardhat-toolbox');

const {
  SEPOLIA_RPC_URL = process.env.ALCHEMY_API_URL || process.env.RPC_URL,
  PRIVATE_KEY,
  ETHERSCAN_API_KEY,
} = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    hardhat: {},
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    sepolia: {
      url: SEPOLIA_RPC_URL || '',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY || '',
  },
};
