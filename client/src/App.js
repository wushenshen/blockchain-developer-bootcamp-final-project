import React, { Component, Fragment } from "react";
import { Flex } from 'rebass';
import SolidarityEconomyContract from "./contracts/SolidarityEconomy.json";
import getWeb3 from "./getWeb3";

import { fromWei } from './utils/fromWei';
import { getCurrentAddress } from "./utils/currentAddress";
import { reloadWindow } from './utils/reload';

import "./styles.css";
import Balances from './components/Balances';
import Banner from './components/Banner';
import Description from './components/Description';
import Info from './components/Info';
import PaymentForm from './components/PaymentForm';
import UserOptions from './components/UserOptions';


class App extends Component {
  state = { web3: null, accounts: null, contract: null, amount: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SolidarityEconomyContract.networks[networkId];

      const instance = new web3.eth.Contract(
        SolidarityEconomyContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Subscribe to events
      instance.events.PaymentReceived(async (error, event) => {
        await this.refreshBalances(instance, web3);
      });

      instance.events.PaymentReleased(async (error, event) => {
        await this.refreshBalances(instance, web3);
      });

      if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
          reloadWindow();
        });
  
        window.ethereum.on('chainChanged', (chainId) => {
          reloadWindow();
        });
      }

      const description = await instance.methods.getDescription().call();

      this.setState({
        web3,
        accounts,
        contract: instance,
        description,
      });

      await this.refreshBalances(instance, web3);

    } catch (error) {
      alert(`Failed to connect to wallet or contract. Make sure you have the MetaMask extension installed.`);
      console.error(error);
    }
  };

  changeAccounts = async () => {
    const { contract, web3 } = this.state;
    if (contract && web3) {
      await this.refreshBalances(contract, web3)
    }
  }

  refreshBalances = async (contract, web3) => {
    const currentAddress = getCurrentAddress(web3);
    
    const amountReleased = await contract.methods.released(currentAddress).call();
    const contractBalance = await web3.eth.getBalance(contract._address);
    const contribution = await contract.methods.getAccountContribution(currentAddress).call();
    const shares = await contract.methods.shares(currentAddress).call();
    const totalReleased = await contract.methods.totalReleased().call();

    this.setState({
      amountReleased: fromWei(web3, amountReleased),
      contractBalance: fromWei(web3, contractBalance),
      contribution: fromWei(web3, contribution),
      currentAddress,
      shares,
      totalReleased: fromWei(web3, totalReleased),
    });
  }

  releaseFunds = () => {
    const { contract, currentAddress } = this.state;
    this.setState({ processingRelease: true });
    contract.methods.release(currentAddress)
      .send({ from: currentAddress })
      .catch((error) => alert(error.message))
      .finally(() => this.setState({ processingRelease: false }));
  }

  sendFunds = (amount) => {
    const { contract, currentAddress, web3 } = this.state;
    this.setState({ processingPayment: true });
    contract.methods.makePayment()
      .send({ from: currentAddress, value: web3.utils.toWei(amount, "ether") })
      .catch((error) => alert(error.message))
      .finally(() => this.setState({ amount: 0, processingPayment: false }))
  }

  handleChange = (event) => {
    this.setState({ amount: event.target.value });
  }

  handleSubmit = (event) => {
    const { amount } = this.state;
    event.preventDefault();
    this.sendFunds(amount);
  }

  render() {
    const {
      amount,
      amountReleased,
      contractBalance,
      contribution,
      description,
      processingPayment,
      processingRelease,
      shares,
      totalReleased,
    } = this.state;

    return (
      <Fragment>
        {!this.state.web3 && <Banner text="Connect to your Kovan wallet" onClick={reloadWindow} />}
        <Flex>
          <div className="container">
            <h1>Payment Splitter </h1>
            {!this.state.web3 && <Info />}
            {this.state.web3 && (
              <div className="main">

                <Description text={description} />

                <Balances contractBalance={contractBalance} totalReleased={totalReleased} />

                <PaymentForm
                  amount={amount}
                  loading={processingPayment}
                  onChange={this.handleChange}
                  onSubmit={this.handleSubmit}
                />

                <UserOptions
                  amountReleased={amountReleased}
                  contractBalance={contractBalance}
                  contribution={contribution}
                  loading={processingRelease}
                  shares={shares}
                  totalReleased={totalReleased}
                  releaseFunds={this.releaseFunds}
                />
              </div>
            )
            }
          </div>
        </Flex>
      </Fragment>
    );
  }
}



export default props =>
    <App {...props} />
