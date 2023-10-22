const hre = require("hardhat");

async function main() {
    const StorageSC = await hre.ethers.getContractFactory("Storage");
    const contract = StorageSC.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3")

    let number = await contract.get()
    console.log(`The value number is ${number}`)

    await contract.set(3)
    number = await contract.get()
    console.log(`the new value number is ${number}`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });