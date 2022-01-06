# Avoiding Common Attacks

## Using Specific Compiler Pragma
- Specific compiler pragma `0.8.0` is used

## Pull Over Push
- The `PaymentSplitter` contract from which `SolidarityEconomy` contract inherits addresses this vulnerability by having a `release` function which can be called to release the funds to a specified address. Thus, the contract prioritizes receiving calls rather than making them. 