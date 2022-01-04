const SolidarityEconomy = artifacts.require("SolidarityEconomy");

const getErrorObj = (obj = {}) => {
  const txHash = Object.keys(obj)[0];
  return obj[txHash];
}

const makeContribution

contract("SolidarityEconomy", function (/* accounts */) {
  it("should assert true", async function () {
    await SolidarityEconomy.deployed();
    return assert.isTrue(true);
  });
});
