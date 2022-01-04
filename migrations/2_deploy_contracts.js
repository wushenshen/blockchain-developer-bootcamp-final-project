var SolidarityEconomy = artifacts.require("./SolidarityEconomy.sol");

module.exports = async function(deployer) {
  let accounts = await web3.eth.getAccounts()
  await deployer.deploy(SolidarityEconomy, [accounts[1], accounts[2], accounts[3]], [55, 35, 10], "An example of a smart contract intended to further the solidarity economy");
};
