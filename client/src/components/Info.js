import React from 'react';

const Info = () => {
  return (
    <div className="info">
      This application allows people to make Ethereum payments that are divided among specified recipients (i.e. payees).
      If you have already contributed, you will see the amount of your contributions below the payment form.
      If you are one of the recipients, you will see additional options to withdraw your funds.
      In both cases, you must be using the authenticated wallet - that is, the wallet from which you contributed or the wallet that is designated as a payee.
    </div>
  )
};

export default Info;