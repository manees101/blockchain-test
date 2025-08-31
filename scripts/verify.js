const hre = require('hardhat');

async function main() {
  const networkName = hre.network.name;
  console.log(`Network: ${networkName}`);

  // Load deployment addresses
  const deployments = require(`../deployments/${networkName}.json`);

  // Verify BooksLibrary
  if (deployments.booksLibrary) {
    try {
      console.log('Verifying BooksLibrary...', deployments.booksLibrary);
      await hre.run('verify:verify', {
        address: deployments.booksLibrary,
        constructorArguments: [],
      });
    } catch (e) {
      console.log('BooksLibrary verify skipped/failed:', e.message || e);
    }
  }

  // Verify HotelRoom
  if (deployments.hotelRoom) {
    try {
      console.log('Verifying HotelRoom...', deployments.hotelRoom);
      await hre.run('verify:verify', {
        address: deployments.hotelRoom,
        constructorArguments: [],
      });
    } catch (e) {
      console.log('HotelRoom verify skipped/failed:', e.message || e);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
