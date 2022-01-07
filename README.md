# Blockchain Developer Bootcamp Final Project

## Deployed Url

[https://final-project-swu.vercel.app/](https://final-project-swu.vercel.app/)

<br />

## Description

This decentralized application (DApp) facilitates payments that are programatically distributed among separate accounts. These payments may represent:

- royalties paid to license artistic and creative works
- purchases of goods or services
- donations made to support organizations or causes
- ticket fees for events like workshops or exhibitions

<br/>

Thus, an account could represent for example, an artist or collaborator involved in the production of a creative work, a wholesaler/retailer/marketer in the supply chain of a good or service, an NGO partner working towards a specific cause, or the hosts of a jointly-produced event. 

<br/>

Ultimately, I hope for one of the recipient accounts to represent a fund that will be collectively managed as a [Decentralized Autonomous Organization (DAO)](https://ethereum.org/en/dao/). This fund could be a mutual aid fund, a credit union, a giving circle, or a fund to address climate change, provide disaster relief, or further social equality. Its exact purpose and governance system is to be determined by the initial members. I imagine that different communities may emerge around different funds. The payment splitting functionality is a way to attract initial community members while providing a value on its own.

<br/>

# User Stories
Kupaima, Minh, and Tara are collaborating to produce a workshop. They decide they will accept donations or ticket fees priced on a sliding scale. They decide to each take 25% of the revenue and contribute the remaining 25% to a fund for environmental protection. They set up a webpage to collect payments and share its link with their friend Jo who wants to attend. 

<br/>

When Jo visits the webpage, a prompt pops up asking her to connect to her cryptocurrency wallet, MetaMask. She logs in and uses her debit card to buy some Ether and complete the purchase. Or, if she happens to already have some Ether, she transfers that into the wallet and pays directly with that.  When Jo makes the payment, it is automatically divided as Kupaima, Minh, and Tara agreed. 

<br/>

Based on her contribution to this environmental protection fund, Jo - and everyone else who has purchased a ticket for the workshop and subsequently contributed to the fund - is eligible to cast a vote towards deciding how those funds are put to use.

<br/>

## Actions
- [x] User can send ETH to the contract address
- [x] User can view how much they have contributed
- [x] User can view their share of the contract funds
- [x] User can request release of their allotted funds
   
<br/>

# Get Started Locally

## Contracts
- `yarn install`
- `ganache-cli -m="bone great morning certain cheese process sleep salt unusual crime pigeon half"`
- In a separate console tab
  - Run `truffle migrate`
  - To test, run `truffle test`

## Front end
- `cd client`
- `yarn install`
- `npm run start`
- Open [`http://localhost:3000/`](http://localhost:3000/)


## Make a few payments
- `truffle console`
- `let instance = await SolidarityEconomy.deployed()`
- `instance.makePayment.sendTransaction({ from: accounts[5], value: web3.utils.toWei("10", "ether")})`
- `instance.makePayment.sendTransaction({ from: accounts[9], value: web3.utils.toWei("20", "ether")})`
- You can now interact with the web app via the local ui at [`http://localhost:3000/`](http://localhost:3000/)
  - Make sure your MetaMask localhost network is port `8545`
  - If you experience nonce errors when sending a transcation, reset the account from Advanced settings
  - To interact as a contributor, import the private keys for accounts[5] and/or accounts[9]
    - 5: `0x5b15a02478d47e68ee46b2223676c7b0e9719a21a02fdd0fb2d4da70323a4464`
    - 9: `0x6963a0da16252d2d75a32281ea3861e3ad08de65d517d1441c25114e373b7f19`
  - To interact as a payee, import the private keys for accounts[1], accounts[2], and/or accounts[3]
    - 1: `0x34874fabad506b8530c7baa190e9a7ac40a3e2a10cdf3ac8aa3a7754a43d0cbc`
    - 2: `0x5c6165db43192a3d955e4ac366f93fc2659e146a0bd114aeedf925acf42c9db1`
    - 3: `0xdb92c7f2919c46e6acb8542295b200d1a34c9a86c9eafc4a52dd31a21811fc47`
- You may copy the following migration into a new migration file and run `migrate` if you would like to see how upgrades work.
## Migration to update payees
Copy the following code to a new migration file
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

<br/>

# Screencast Link
TODO

<br/>

# Public address for certification
`0xe92717f9a02b8309baee41e96602e8b63babc66c` 

<br/>

# Technology Stack

### Web
- [React](https://reactjs.org/) User interface
- [web3.js](https://github.com/ChainSafe/web3.js) Ethereum Javascript API
- [MetaMask](https://metamask.io/) Crypto wallet

### Smart Contracts
- [Solidity](https://github.com/ethereum/solidity) Smart contract language
- [Open Zeppelin](https://openzeppelin.com/contracts/) Smart contract library

### Ethereum
- [Truffle](https://github.com/trufflesuite/truffle) Development environment, testing framework, and asset pipeline for Ethereum
- [Ganache](https://www.trufflesuite.com/ganache) Local blockchain development

### Infrastructure
- [Infura](https://infura.io/) Ethereum node connectivity

<br />

# Background & Inspiration
My intention is to explore and further alternative economic models, particuarly the solidarity economy, a new paradigm for an economic system that centers community ownership and democratic governance for political, cultural, and economic power. This work is inspired by [Art.coop](https://art.coop/), an initiative led by artists and cultural workers.

<br/>

Another new economic model, proposed by Kate Raworth, is [doughtnut economics](https://www.kateraworth.com/doughnut/), which describes the economy as comprised of not only the market and state, but also of households which nurture each of us and the commons which we all share. This economy is embedded within society and the living world. There is simulatenously a social foundation that must be met in order for each of us to thrive and an ecological ceiling that, when surpassed, irreparably damages our planetary systems. Within these two is an area (shaped as a donut) which represents the safe and just space for humanity. I propose these dimensions as a useful framework for thinking about what sort of areas need funding.

 <img src="https://economicsdetective.com/wp-content/uploads/2017/03/doughnut.jpg" style="width: 400px; display: block; margin: 0 auto;" />

<br/>

# Notes for Future Iterations
- User experience
  - Implement something like Gas Station Network so users can pay tx fees using fiat
- Marketplace
  -  Where contributors can browse contracts
  -  Where people can deploy a contract, defining payees and their shares
- DAO / tokenomics
  - Governance tokens minted based on a % of their contribution
    - The fund is another payee defined during deployment
  - Tokens used to allow a user to vote on how those funds are distributed
  - TODO: decide on DAO and/or decision-making framework
    - I am curious to explore [Quadratic Voting](https://www.radicalxchange.org/concepts/quadratic-voting/).
  - TODO: think about the design of such a token
- Potential technologies
  - Ethereum
    - [Gas Now](https://www.gasnow.org/) ETH Gas Price forecast system
    - [GSN](https://opengsn.org/) Ethereum Gas Station Network allows DApp users to interact with contracts without needing ETH for tx fees
  - DAO
    - [Aragon](https://aragon.org/dao) DAO framework
    - [Zodiac](https://github.com/gnosis/zodiac) Library for composable DAO tooling
  - Infrastructure
    - [IPFS](https://ipfs.io/) Decentralized file storage
    - [Swarm](https://www.ethswarm.org/) Decentralised storage and Ethereum node connectivity
    - [Pinata](https://www.pinata.cloud/) Interface for IPFS
    - [Polygon](https://polygon.technology/) Multichain Ethereum ecosystem