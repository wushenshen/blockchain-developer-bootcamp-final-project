# Payment Splitting DApp & Fund DAO
This decentralized application (DApp) facilitates payments that are programatically distributed among separate accounts. These payments may represent:

- royalties paid to license artistic and creative works
- purchases of goods or services
- donations made to support organizations or causes
- ticket fees for events like workshops or exhibitions

<br/>

Thus, an account could represent for example, an artist or collaborator involved in the production of a creative work, a wholesaler/retailer/marketer in the supply chain of a good or service, an NGO partner working towards a specific cause, or the hosts of a jointly-produced event. 

<br/>

One of the recipient accounts represents a fund that will be collectively managed as a [Decentralized Autonomous Organization (DAO)](https://ethereum.org/en/dao/). This fund could be a mutual aid fund, a credit union, a giving circle, or a fund to address climate change, provide disaster relief, or further social equality. Its exact purpose and governance system is to be determined by the initial members - I am curious to explore [Quadratic Voting](https://www.radicalxchange.org/concepts/quadratic-voting/). I imagine that different communities may emerge around different funds. The payment splitting functionality is a way to attract initial community members while providing a value on its own.

<br/>

# Background & Inspiration
My intention is to explore and further alternative economic models, particuarly the solidarity economy, a new paradigm for an economic system that centers community ownership and democratic governance for political, cultural, and economic power. This work is inspired by [Art.coop](https://art.coop/), an initiative led by artists and cultural workers.

<br/>

Another new economic model, proposed by Kate Raworth, is [doughtnut economics](https://www.kateraworth.com/doughnut/), which describes the economy as comprised of not only the market and state, but also households which nurture each of us and the commons which we all share. This economy is embedded within society and the living world. There is a social foundation that must be met in order for each of us to thrive. There is an ecological ceiling that, when surpassed, irreparably damages our planetary systems. Within these two is an area (shaped as a donut) which represents the safe and just space for humanity. I propose these dimensions as a useful framework for thinking about what sort of areas need funding.

![Doughtnut Economics](https://economicsdetective.com/wp-content/uploads/2017/03/doughnut.jpg "Doughtnut Economics")

<br/>

# User Stories
Kupaima, Minh, and Tara are collaborating to produce a workshop. They decide they will accept donations or ticket fees priced on a sliding scale. They decide to each take 25% of the revenue and contribute the remaining 25% to a fund for environmental protection. They set up a webpage to collect payments and share its link with their friend Jo who wants to attend. 

<br/>

When Jo visits the webpage, a prompt pops up asking her to connect to her cryptocurrency wallet. She logs in and uses her debit card to buy some Ether and complete the purchase. Or, if she happens to already have some Ether, she transfers that into the wallet and pays directly with that.  When Jo makes the payment, it is automatically divided as Kupaima, Minh, and Tara agreed. 

<br/>

Based on her contribution to this environmental protection fund, Jo - and everyone else who has purchased a ticket for the workshop and subsequently contributed to the fund - is eligible to cast a vote towards deciding how those funds are put to use.

<br/>

## Actions
- [x] User can send ETH to the contract address
- [x] User can view how much they have contributed
- [x] User can view their share of the contract funds
- [x] User can request release of their allotted funds to their address

## Future Iterations
- Upgradeability
  - Allow an admin to update payees and their shares
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
  - TODO: think about the design of such a token

   
<br/>

# Get Started Locally
1. Start local blockchain using `ganache-cli`
2. Enter `truffle console` in terminal to open up a Truffle console
3. In another terminal, `cd client && npm run start` to start the React app

<br/>

# Potential Technologies and Tools

### Web
- [React](https://reactjs.org/) User interface
- [web3.js](https://github.com/ChainSafe/web3.js) Ethereum Javascript API
- [MetaMask](https://metamask.io/) Crypto wallet

### Smart Contracts
- [Solidity](https://github.com/ethereum/solidity) Smart contract language
- [Open Zeppelin](https://openzeppelin.com/contracts/) Smart contract library, particularly their [`PaymentSplitter`](https://docs.openzeppelin.com/contracts/3.x/api/payment#PaymentSplitter) utility

### Ethereum
- [Truffle](https://github.com/trufflesuite/truffle) Development environment, testing framework, and asset pipeline for Ethereum
- [Ganache](https://www.trufflesuite.com/ganache) Local blockchain development
- [Gas Now](https://www.gasnow.org/) ETH Gas Price forecast system
- [GSN](https://opengsn.org/) Ethereum Gas Station Network allows DApp users to interact with contracts without needing ETH for tx fees

### DAO
- [Aragon](https://aragon.org/dao) DAO framework
- [Zodiac](https://github.com/gnosis/zodiac) Library for composable DAO tooling

### Infrastructure
- [IPFS](https://ipfs.io/) Decentralized file storage
- [Infura](https://infura.io/) Ethereum node connectivity
- [Swarm](https://www.ethswarm.org/) Decentralised storage and Ethereum node **connectivity**
- [Pinata](https://www.pinata.cloud/) Interface for IPFS
- [Polygon](https://polygon.technology/) Multichain Ethereum ecosystem
