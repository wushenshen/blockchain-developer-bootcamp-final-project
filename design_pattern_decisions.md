# Design Pattern Decisions

## Inheritance and Interfaces 
- The `SolidarityEconomy` contract inherits OpenZeppelin's `PaymentSplitter` contract to track payees, their shares, and release funds.
- It extends this functionality by adding the ability to add a description and to track how much an address has contributed.

## Upgradable Contracts
- Use OpenZeppelin Upgrades Plugin to make contract upgradeable