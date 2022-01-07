import React, { Component, Fragment } from "react";
import { Button, Card, Flex, Box } from 'rebass';
import theme from './theme';
import { ThemeProvider } from '@emotion/react';
import SolidarityEconomyContract from "./contracts/SolidarityEconomy.json";
import getWeb3 from "./getWeb3";
import { getCurrentAddress } from "./utils/currentAddress";

import "./App.css";

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
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

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

  releaseFunds = async () => {
    const { contract, currentAddress } = this.state;
    try {
      await contract.methods.release(currentAddress).send({ from: currentAddress });
    } catch (error) {
      alert(error.message);
    }
  }

  sendFunds = async (amount) => {
    const { contract, currentAddress, web3 } = this.state;
    try {
      await contract.methods.makePayment().send({ from: currentAddress, value: web3.utils.toWei(amount, "ether") });
    } catch (error) {
      alert(error.message);
    } finally {
      this.setState({ amount: 0 })
    }
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
    const { amount, amountReleased, contractBalance, contribution, currentAddress, shares, totalReleased, description } = this.state;

    return (
      <Flex>
        
        <div className="App">
          <h1>Solidarity Economy</h1>

          {!this.state.web3
            ? <div>Connect to your Kovan wallet.</div>
            : (<Fragment>
                <Description text={description} />
                <BalancesInfo contractBalance={contractBalance} totalReleased={totalReleased} />
                <PaymentForm amount={amount} onChange={this.handleChange} onSubmit={this.handleSubmit} />
                <UserOptions
                  amountReleased={amountReleased}
                  contractBalance={contractBalance}
                  contribution={contribution}
                  currentAddress={currentAddress}
                  shares={shares}
                  totalReleased={totalReleased}
                  releaseFunds={this.releaseFunds}
                />
              </Fragment>)
          }

        </div>
      </Flex>
    );
  }
}

const Description = ({ text }) => {
  return (
    <Card
      width={1/2}
      Flex
      sx={{
        bg: theme.colors.primary,
        px: 4,
        py: 10,
        marginX: 'auto',
        marginY: 10,
        textAlign: 'center',
        justifyContent: 'center',
        fontStyle: 'italic',
      }}
    >
      {text}
    </Card>
  )
}

const BalancesInfo = ({ contractBalance, totalReleased }) => {
  return (
    <Box
      width={1/2}
      sx={{
        bg: theme.colors.lightyellow,
        px: 4,
        py: 10,
        marginX: 'auto',
        marginY: 10,
        textAlign: 'center',
        justifyContent: 'center',
      }}
    >
      {contractBalance && <div>Current balance: {contractBalance} ETH</div>}
      {totalReleased && <div>Total released: {totalReleased} ETH</div>}
      {totalReleased && <div>Total contributed: {parseFloat(contractBalance) + parseFloat(totalReleased)} ETH</div>}
    </Box>
  )
}

const PaymentForm = ({ amount, onSubmit, onChange }) => {
  return (
    <Box
      width={1/2}
      sx={{
        bg: theme.colors.lightblue,
        px: 4,
        py: 10,
        marginX: 'auto',
        marginY: 10,
        textAlign: 'center',
        justifyContent: 'center',
      }}
    >
      <h3>Make a Payment</h3>
      <form>
        <label>Amount (in ETH): 
          <input type="number" value={amount} onChange={onChange} />
        </label>
        <Button
          onClick={onSubmit}
          sx={{
            bg: theme.colors.secondary,
            px: 4,
            py: 10,
            marginX: 'auto',
            marginY: 10,
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          Send
        </Button>
      </form>
    </Box>
  )
}

const UserOptions = ({ amountReleased, contractBalance, contribution, currentAddress, shares, releaseFunds, totalReleased }) => {
  const isPayee = shares && shares > 0;
  const isContributor = contribution && contribution > 0;
  const width = isPayee && isContributor ? 1 : 1/2

  const couldBeWithdrawn = (parseFloat(shares)/100)*(parseFloat(contractBalance) + parseFloat(totalReleased)) - parseFloat(amountReleased)

  return (
    <div className="userData">
      <div className="userOptions">
      {isPayee &&
        <Box
          width={width}
          Flex
          sx={{
            bg: theme.colors.lightblue,
            px: 4,
            py: 10,
            marginX: 2,
            marginY: 10,
            textAlign: 'left',
            justifyContent: 'center',
          }}
        >
          <h3>Payee</h3>
          <div>
            Your share is <strong>{shares}%</strong> of total contributions and you have currently withdrawn <strong>{amountReleased}</strong> ETH.
            <br/><br/>
            {couldBeWithdrawn > 0 
              ? <span>You can withdraw <strong>{couldBeWithdrawn}</strong> ETH. Click the button below to release all funds.</span>
              : <span>You have already withdrawn your shares.</span>
            }
          </div>
          { couldBeWithdrawn > 0 && (<Button
            onClick={releaseFunds}
            sx={{
              bg: theme.colors.secondary,
              px: 4,
              py: 10,
              marginX: 'auto',
              marginY: 10,
              textAlign: 'center',
              justifyContent: 'center',
            }}
          >
            Withdraw Funds
          </Button>)}
        </Box>
      }
      {isContributor &&
        <Box
          width={width}
          Flex
          sx={{
            bg: theme.colors.lightblue,
            px: 4,
            pt: 15,
            pb: 30,
            marginX: 2,
            marginY: 10,
            textAlign: 'left',
            justifyContent: 'center',
          }}
        >
          <h3>Contributor</h3>
            You have contributed <strong>{contribution}</strong> ETH
        </Box>
      }
      </div>
    </div>
  )
}

export default props =>
  <ThemeProvider theme={theme}>
    <App {...props} />
  </ThemeProvider>
