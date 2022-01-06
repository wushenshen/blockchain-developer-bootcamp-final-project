// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

contract SolidarityEconomy is PaymentSplitter {
  mapping(address => uint256) private _contributors;
  string private description;

  constructor(address[] memory _payees, uint256[] memory _shares, string memory _description)
    PaymentSplitter(_payees, _shares)
    payable {
      description = _description;
  }

  /**
   * @dev Make a payment to the contract
   */
  function makePayment() payable public {
    require(msg.value > 0);
    addContributor(_msgSender(), msg.value);
    emit PaymentReceived(_msgSender(), msg.value);
  }

  /**
   * @dev Add a contributor's payment to their running total to track how much
   * they have contributed to the contract.
   */
  function addContributor(address account, uint256 payment) internal {
    _contributors[account] += payment;
  }

  /**
   * @dev Getter for the amount an `account` has contributed to the contract
   */
  function getAmountContributed(address account) public view returns (uint256) {
    return _contributors[account];
  }

  /**
   * @dev Getter for the description set during contract creation
   */
  function getDescription() public view returns (string memory) {
    return description;
  }
}
