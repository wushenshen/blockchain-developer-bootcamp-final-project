# Design Pattern Decisions

## Inheritance and Interfaces 
- The `SolidarityEconomy` contract inherits OpenZeppelin's `PaymentSplitter` contract to track payees, their shares, and release funds.
- It extends this functionality by adding the ability to add a description and to track how much an address has contributed.

## Access Control Design Patterns
- Use the `Ownable` design pattern in two functions which are used during migrations: `transferBalance()` and `migrateData()`.

## Upgradable Contracts (Experimental)
- My intention is to allow the owner to update the payees and their shares (by creating a new instance of the contract) while transferring the existing balance and persisting the contributors and contributions state. This is accomplished via the `transferBalance` and `migrateData` functions. This is further restricted to only happen once via a `migration` boolean. In production, I'd want to follow a multisig wallet pattern rather than a single owner, this is a start.
- You may copy the following migration into a new migration file and run `migrate` if you would like to see how upgrades work.

```
const SolidarityEconomy = artifacts.require("./SolidarityEconomy.sol");

module.exports = async function(deployer) {
  let accounts = await web3.eth.getAccounts()
  const existing = await SolidarityEconomy.deployed();
  const existingBalance = await web3.eth.getBalance(existing.address);
  const contributors = await existing.getContributorAddresses();

  let updated;

  const payees = [accounts[1], accounts[3]];
  const shares = [40, 60];
  const description = "An example of a smart contract intended to further the solidarity economy, after payees have changed.";

  if (existingBalance > 0 || !!contributors.length) {
    updated = await deployer.deploy(SolidarityEconomy, payees, shares, description);
    let amounts = []
    contributors.forEach(async c => amounts.push(await existing.getAccountContribution(c)))
    await existing.transferBalance(updated.address);
    await updated.migrateData(contributors, amounts);
  } else {
    updated = await deployer.deploy(SolidarityEconomy, payees, shares, description);
  }
};

```
- I attempted to get this working with the `@openzeppelin/truffle-upgrades` package but was not able to get it fully working. Given more time, I would re-visit that to give it another go.