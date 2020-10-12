
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 5545,
      network_id: "5777", // Match any network id
      gas: 5000000,
    },
  },
  
  compilers: {
    solc: {
      version: "0.6.12",
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200      // Default: 200
        },
      }
    },
  }
};
