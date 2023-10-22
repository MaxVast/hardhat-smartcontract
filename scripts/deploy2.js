// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const arg = 100;
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;
  const StorageSC = await hre.ethers.getContractFactory("Storage");
  const storageSC = await StorageSC.deploy(arg, { value: arg });

  await storageSC.deployed();

  const value =   await storageSC.get()
  console.log(
    `StorageSC storagedata ${arg} deployed to ${storageSC.address}`
  );
    console.log(value)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
