# Design Pattern Decisions

## Inheritance and Interfaces 
- The `SolidarityEconomy` contract inherits OpenZeppelin's `PaymentSplitter` contract to track payees, their shares, and release funds.
- It extends this functionality by adding the ability to add a description and to track how much an address has contributed.

## Access Control Design Patterns
- Use the `Ownable` design pattern in two functions which are used during migrations: `transferBalance()` and `migrateData()`.

## Upgradable Contracts
- The intention is to allow the owner to update the payees and their shares while transferring the existing balance and persisting the contributors and contributions state. This is further restricted to only happen once via a `migration` boolean.