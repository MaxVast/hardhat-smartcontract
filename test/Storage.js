const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

describe("Storage Contract", function () {
  let storageContract;
  let owner;
  let addr1;

  before(async function () {
    [owner, addr1] = await ethers.getSigners();
    const Storage = await ethers.getContractFactory("Storage");
    storageContract = await Storage.deploy(42); // Initial value is 42
    await storageContract.deployed();
  });

  it('should get the number and the number should be equal to 42', async function() {
    let storedValue = await storageContract.get()
    assert(storedValue.toString() === "42");
    expect(storedValue.toNumber()).to.equal(42);
  })

  it("Should set the number to 70 with Address1",async function() {
    await storageContract.connect(addr1).set(70);
    const newValue = await storageContract.get();
    expect(newValue.toNumber()).to.equal(70);
  })

  it("Should have the correct initial value", async function () {
    const storedValue = await storageContract.get();
    expect(storedValue.toNumber()).to.equal(70);
  });

  it("Should allow setting a new value of type uint", async function () {
    await storageContract.connect(owner).set(100);
    const newValue = await storageContract.get();
    expect(newValue.toNumber()).to.equal(100);
  });

  it("Should have the same value of type uint after setting", async function () {
    await storageContract.connect(owner).set(42); // Setting it back to the initial value
    const storedValue = await storageContract.get();
    expect(storedValue.toNumber()).to.equal(42);
  });
});
