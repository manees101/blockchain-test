const fs = require('fs');
const path = require('path');
const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);

  // Deploy BooksLibrary
  const BooksLibrary = await hre.ethers.getContractFactory('BooksLibrary');
  const books = await BooksLibrary.deploy();
  await books.waitForDeployment();
  const booksAddress = await books.getAddress();
  console.log(`BooksLibrary deployed at: ${booksAddress}`);

  // Deploy HotelRoom
  const HotelRoom = await hre.ethers.getContractFactory('HotelRoom');
  const hotel = await HotelRoom.deploy();
  await hotel.waitForDeployment();
  const hotelAddress = await hotel.getAddress();
  console.log(`HotelRoom deployed at: ${hotelAddress}`);

  // Save deployments
  const outDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const file = path.join(outDir, `${hre.network.name}.json`);
  const data = { network: hre.network.name, booksLibrary: booksAddress, hotelRoom: hotelAddress, timestamp: new Date().toISOString() };
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log(`Saved deployments to ${file}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
