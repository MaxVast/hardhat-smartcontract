const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bank Contract", function () {
    let bankContract;
    let owner, addr1;

    beforeEach(async function () {
        [ owner, addr1 ] = await ethers.getSigners();
        const Bank = await ethers.getContractFactory("Bank");
        bankContract = await Bank.deploy(owner.address);
        await bankContract.deployed();
    });

    describe("Deposit", () => {
        it('Should allow the owner to deposit funds and check the smart contract Balance', async function() {
            let _amount = ethers.utils.parseUnits("1");

            const contractBalanceBeforeDeposit = await ethers.provider.getBalance(bankContract.address)
            expect(contractBalanceBeforeDeposit === ethers.utils.parseUnits("0"));
            await bankContract.connect(owner).deposit({value: _amount});
            const contractBalanceAfterDeposit = await ethers.provider.getBalance(bankContract.address)
            expect(contractBalanceAfterDeposit === _amount);
        })

        it("Should allow the owner to deposit funds and emit a Deposit event", async () => {
            let _amount = ethers.utils.parseUnits("1");
            await expect(bankContract.connect(owner).deposit({value: _amount}))
                .to.emit(bankContract, 'Deposit')
                .withArgs(owner.address, _amount);
        })

        it("Should not allow to deposit less 0.1 ether", async () => {
            let _amount = ethers.utils.parseUnits("0.09");
            await expect(bankContract.connect(owner).deposit({value: _amount}))
                .to.be.rejectedWith(
                    bankContract,
                    "not enough funds provided");
        })

        it('Should not allow a address to deposit ETH', async function() {
            let _amount = ethers.utils.parseUnits("2");

            await expect(bankContract.connect(addr1).deposit({value: _amount}))
                .to.be.revertedWithCustomError(
                    bankContract,
                    "OwnableUnauthorizedAccount")
                .withArgs(addr1.address);
        })
    })

    describe("Withdraw", () => {
        it("Should allow you to withdraw event", async () => {
            let _amount = ethers.utils.parseUnits("1");
            await bankContract.connect(owner).deposit({value: _amount});

            let _amountForWithdraw = ethers.utils.parseUnits("0.5");
            await expect(bankContract.connect(owner).withdraw(_amountForWithdraw))
                .to.emit(bankContract, 'Withdraw')
                .withArgs(owner.address, _amountForWithdraw);
        })

        it("Should not allow withdrawal of an amount greater than the bank balance", async () => {
            let _amount = ethers.utils.parseUnits("1");
            await bankContract.connect(owner).deposit({value: _amount});

            let _amountForWithdraw = ethers.utils.parseUnits("2");
            await expect(bankContract.connect(owner).withdraw(_amountForWithdraw))
                .to.be.rejectedWith(
                    bankContract,
                    "you cannot withdraw this much");
        })

        it("Should allow you to withdraw and check the smart contract Balance", async () => {
            let _amount = ethers.utils.parseUnits("1");
            await bankContract.connect(owner).deposit({value: _amount});
            const contractBalanceAfterDeposit = await ethers.provider.getBalance(bankContract.address)
            let _amountForWithdraw = ethers.utils.parseUnits("0.5");
            await bankContract.connect(owner).withdraw(_amountForWithdraw);
            await expect(contractBalanceAfterDeposit.sub(contractBalanceAfterDeposit));
        })
    })
});