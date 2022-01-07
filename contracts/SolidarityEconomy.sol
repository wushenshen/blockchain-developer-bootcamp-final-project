// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

/**
  @title A contract to support the solidarity economy
  @author Shen-Shen Wu
  @notice You can use this contract to receive payments, divide those payments among recipients, and track contributors and their contributions
 */
contract SolidarityEconomy is Ownable, PaymentSplitter {
  /// @dev Description populated during contract creation
  string private description;

  /// @dev Mapping of contributing addresses and the amount they have contributed
  mapping(address => uint256) private contributions;

  /// @dev Array of contributing addresses used when migrating from one version of this contract to another
  address[] private contributors;

  /// @dev Boolean to indicate whether the contract has been migrated
  bool private migrated;

  constructor(address[] memory _payees, uint256[] memory _shares, string memory _description)
    PaymentSplitter(_payees, _shares)
    payable {
      description = _description;
  }

  /**
   @notice Make a payment to the contract, track the contribution, and emit the PaymentReceived event
   */
  function makePayment() payable public {
    require(msg.value > 0);
    addContributor(_msgSender(), msg.value);
    emit PaymentReceived(_msgSender(), msg.value);
  }

  /**
   @dev Add a contributor to the contributors array and add the payment to their running total of contributions
   @param account The contributor account addres
   @param payment The amount contributed
   */
  function addContributor(address account, uint256 payment) internal {
    contributors.push(account);
    contributions[account] += payment;
  }

  /**
   @notice Getter for the amount an `account` has contributed to the contract
   @param account The address for which contributions are being requested
   @return Total amount contributed by the requested account
   */
  function getAccountContribution(address account) public view returns (uint256) {
    return contributions[account];
  }

  /**
   @notice Getter for the list of accounts that have contributed to the contract
   @return An array of addresses that have contributed to the contract
   */
  function getContributorAddresses() public view returns (address[] memory) {
    return contributors;
  }

  /**
   @notice Getter for the description set during contract creation
   @return String representating contract description
   */
  function getDescription() public view returns (string memory) {
    return description;
  }

  /**
   @notice Owner-only function used when migrating from one version of the contract to the next, it transfers the balance
   @param _to Address of the new contract version
   */
  function transferBalance(address payable _to) public onlyOwner {
    (bool sent, bytes memory data) = _to.call{value: address(this).balance }("");
    require(sent, "Failed to send Ether");
  }

  /**
   @notice Owner-only function used when migrating from one version of the contract to the next, it migrates the contributors and contribution history 
   @param _contributors Array of contributors from previous version of contract
   @param _contributions Array of contributions from previous version of contract
   */
  function migrateData(address[] calldata _contributors, uint256[] calldata _contributions) public onlyOwner {
    require(!migrated, "Contract has already been migrated");
    migrated = true;
    for (uint i=0; i<_contributors.length; i++) {
      addContributor(_contributors[i], _contributions[i]);
    }
  }
}
