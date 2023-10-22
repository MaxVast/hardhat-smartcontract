const hre = require("hardhat");

async function main() {
  const provider = hre.ethers.provider;
  const address =  "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
  try {
    const balanceWei = await provider.getBalance(address);

    const balanceEther = ethers.utils.formatEther(balanceWei);

    console.log(`Solde de l'adresse ${address}: ${balanceEther} ETH`);
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
