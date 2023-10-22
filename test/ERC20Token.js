const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20Token", function () {
  const _name = "Alyra";
  const _symbol = "ALY";
  const _decimal = 18;
  const _initialSupply = ethers.utils.parseUnits("10000", _decimal);
  let _owner, addr1, _spender;

  let MyTokenInstance;

  beforeEach(async function () {
    [_owner, addr1, _spender] = await ethers.getSigners();
    const MyToken = await ethers.getContractFactory("MyToken");
    MyTokenInstance = await MyToken.deploy( _initialSupply);
    await MyTokenInstance.deployed();
  });

  it("has a name", async function () {
    expect(await MyTokenInstance.name()).to.equal(_name);
  });

  it("has a symbol", async function () {
    expect(await MyTokenInstance.symbol()).to.equal(_symbol);
  });

  it("has a decimal", async function () {
    expect(await MyTokenInstance.decimals()).to.equal(_decimal);
  });

  it("check first balance", async function () {
    expect(await MyTokenInstance.balanceOf(_owner.address)).to.equal(_initialSupply);
  });

  it("check balance after transfer", async function () {
    let amount = ethers.utils.parseUnits("100", _decimal); // Amount in wei
    let balanceOwnerBeforeTransfer = await MyTokenInstance.balanceOf(_owner.address);
    let balanceRecipientBeforeTransfer = await MyTokenInstance.balanceOf(addr1.address);

    expect(balanceRecipientBeforeTransfer).to.equal(0);

    await MyTokenInstance.connect(ethers.provider.getSigner(_owner.address)).transfer(addr1.address, amount);

    let balanceOwnerAfterTransfer = await MyTokenInstance.balanceOf(_owner.address);
    let balanceRecipientAfterTransfer = await MyTokenInstance.balanceOf(addr1.address);

    expect(balanceOwnerAfterTransfer).to.equal(balanceOwnerBeforeTransfer.sub(amount));
    expect(balanceRecipientAfterTransfer).to.equal(balanceRecipientBeforeTransfer.add(amount));
  });

  it("Check if Approval done", async function () {
    const approvedAmount = ethers.utils.parseUnits("500", _decimal);
    const allowanceBeforeApproval = await MyTokenInstance.allowance(_owner.address, _spender.address);
    expect(allowanceBeforeApproval).to.equal(0);

    await MyTokenInstance.connect(_owner).approve(_spender.address, approvedAmount);
    const allowance = await MyTokenInstance.allowance(_owner.address, _spender.address);
    expect(allowance).to.equal(approvedAmount);
  })

  it("Check if TransferFrom done", async function () {
    const approvedAmount = ethers.utils.parseUnits("500", _decimal);
    const transferAmount = ethers.utils.parseUnits("500", _decimal);
    await MyTokenInstance.connect(_owner).approve(_spender.address, transferAmount);

    await MyTokenInstance.connect(_spender).transferFrom(_owner.address, _spender.address, transferAmount);

    const balanceOwnerAfterTransferFrom = await MyTokenInstance.balanceOf(_owner.address);
    const balanceRecipientAfterTransferFrom = await MyTokenInstance.balanceOf(_spender.address);
    const newAllowance = await MyTokenInstance.allowance(_owner.address, _spender.address);

    expect(balanceOwnerAfterTransferFrom).to.equal(_initialSupply.sub(transferAmount));
    expect(balanceRecipientAfterTransferFrom).to.equal(transferAmount);
    expect(newAllowance).to.equal(approvedAmount.sub(transferAmount));
  })
});
