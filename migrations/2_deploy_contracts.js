const Token = artifacts.require("Token");

const EthSwap = artifacts.require("EthSwap");

module.exports = async function(deployer) {

  // Deploy Token
  await deployer.deploy(Token);
  const token = await Token.deployed()

  // Deploy EthSwap
  await deployer.deploy(EthSwap, token.address);
  const ethSwap = await EthSwap.deployed()

  //Transfer all tokens to EthSwap (1 million)
  addressTo = await ethSwap.address

  await token.transfer(addressTo, '1000000000000000000000000')
};
