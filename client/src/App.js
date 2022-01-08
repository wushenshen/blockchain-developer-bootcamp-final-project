import React, { Component, Fragment } from "react";
import { Flex } from 'rebass';
import theme from './theme';
import { ThemeProvider } from '@emotion/react';
import SolidarityEconomyContract from "./contracts/SolidarityEconomy.json";
import getWeb3 from "./getWeb3";
import { getCurrentAddress } from "./utils/currentAddress";

import "./styles.css";
import Balances from './components/Balances';
import Banner from './components/Banner';
import Connect from './components/Connect';
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
    await this.refreshBalances(contract, web3)
  }

  fromWei = (amount) => {
    const { web3 } = this.state;
    if (amount && typeof amount !== 'string') {
      amount = amount.toString()
      return web3.utils.fromWei(amount, 'ether');
    }
    return web3.utils.fromWei(amount, 'ether');
  }

  refreshBalances = async (contract, web3) => {
    const currentAddress = getCurrentAddress(web3);
    const shares = await contract.methods.shares(currentAddress).call();
    const contribution = this.fromWei(await contract.methods.getAccountContribution(currentAddress).call());
    const amountReleased = this.fromWei(await contract.methods.released(currentAddress).call());
    const contractBalance = this.fromWei(await web3.eth.getBalance(contract._address));
    const totalReleased = this.fromWei(await contract.methods.totalReleased().call())

    this.setState({
      amountReleased,
      contractBalance,
      contribution,
      currentAddress,
      shares,
      totalReleased,
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
        {!this.state.web3 && <Banner text="Connect to your Kovan wallet" />}
        <Flex>
          <div className="container">
            <h1>Payment Splitter </h1>
            <Info />
            {this.state.web3 && (
              <div className="main">
                <Connect onClick={this.changeAccounts} />

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
  <ThemeProvider theme={theme}>
    <App {...props} />
  </ThemeProvider>
