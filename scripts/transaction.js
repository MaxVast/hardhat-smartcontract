const { ethers } = require('hardhat');

async function main() {

  const senderPrivateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
  const recipientAddress = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC';
  const etherAmount = ethers.utils.parseEther('100');

  const senderWallet = new ethers.Wallet(senderPrivateKey, ethers.provider);

  const tx = await senderWallet.sendTransaction({
    to: recipientAddress,
    value: etherAmount,
  });

  await tx.wait();

  console.log(`Transaction envoyée : ${tx.hash}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
