import React from 'react';

const Info = () => {
  return (
    <div className="info">
      This application allows people to make Ethereum payments towards a contract. 
      Payments made to this contract are divided among specified recipients (i.e. payees).
      These payees are defined during contract creation.
      <br/><br/>
      Please connect to your MetaMask wallet in order to access the following application functionality:
      <br/><br/>
      <ul>
        <li>View payee addresses</li>
        <li>Make payments via the payment form</li>
        <li>View the amount of your contributions (if you've made a payment)</li>
        <li>Request your share of the payments (if you're one of the payees)</li>
      </ul>
    </div>
  )
};

export default Info;