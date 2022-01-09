const SolidarityEconomy = artifacts.require("SolidarityEconomy");

const getErrorObj = (obj = {}) => {
  const txHash = Object.keys(obj)[0];
  return obj[txHash];
}

contract("SolidarityEconomy", (accounts) => {
  const [owner, account1, account2, account3, account4, account5] = accounts;
  const shares = [45, 45, 10];
  const description = "Example description";

  const BN = web3.utils.BN;
  const getBalance = web3.eth.getBalance;
  const toWei = amount => web3.utils.toWei(amount, "ether");
  const fromWei = amount => web3.utils.fromWei(amount, "ether");

  const createNewContract = async () => {
    const newPayees = [account1, account3];
    const newShares = [40, 60];
    const newDescription = 'Example of new description';
    return await SolidarityEconomy.new(newPayees, newShares, newDescription);
  }
  
  beforeEach(async () => {
    instance = await SolidarityEconomy.new([account1, account2, account3], shares, description);
  });

  /// Tests that the constructor works as expected: setting the owner,
  /// the payees, their shares, and the description
  describe("constructor", () => {
    it("correctly sets first account as the owner", async () => {
      assert.equal(await instance.owner(), owner);
    });

    it("correctly sets payees", async () => {
      assert.equal(await instance.payee(0), account1);
      assert.equal(await instance.payee(1), account2);
      assert.equal(await instance.payee(2), account3);
    });
  
    it("correctly sets shares", async () => {
      assert.equal(await instance.shares(account1), shares[0]);
      assert.equal(await instance.shares(account2), shares[1]);
      assert.equal(await instance.shares(account3), shares[2]);
    });
  
    it("correctly sets description", async () => {
      assert.equal(await instance.getDescription(), description);
    });
  });

  /// Tests the make payment functionality: increasing the contract balance
  /// and tracking contributors and their contributions
  describe("makePayment", () => {
    it("increases contract balance", async () => {
      const amount = new BN(1);
      const balanceBefore = await getBalance(instance.address);
      await instance.makePayment.sendTransaction({ from: account4, value: toWei(amount) });
      const balanceAfter = fromWei(await getBalance(instance.address));
      assert.equal(balanceAfter, new BN(balanceBefore).add(amount))
    });

    it("correctly tracks contributors and their contributions", async () => {
      await instance.makePayment.sendTransaction({ from: account4, value: 1 });
      assert.equal(await instance.getAccountContribution(account4), 1);

      await instance.makePayment.sendTransaction({ from: account5, value: 5 });
      assert.equal(await instance.getAccountContribution(account5), 5);

      assert.deepEqual(await instance.getContributorAddresses(), [account4, account5]);
    });
  });

  /// Tests the release functionality: that the amount released is recorded,
  /// that the payee's balance increases as expected, and that the appropriate errors
  /// are thrown when the account is not a payee or when it has no funds to release
  describe("release", () => {
    it("correctly releases funds to a payee", async () => {
      await instance.makePayment.sendTransaction({ from: account4, value: toWei("10")});

      const account3BalanceBefore = await getBalance(account3);
      await instance.release(account3);
      const account3BalanceAfter = await getBalance(account3);

      const released = await instance.released(account3);

      assert.equal(account3BalanceAfter, new BN(account3BalanceBefore).add(new BN(released)));
    });

    it("throws an error if the account is not a payee", async () => {
      try {
        await instance.release(account5);
      } catch (e) {
        const { error, reason } = getErrorObj(e.data);
        assert.equal(error, 'revert');
        assert.equal(reason, "PaymentSplitter: account has no shares");
      }
    });

    it("throws an error if there are no funds to release", async () => {
      try {
        await instance.release(account1);
      } catch (e) {
        const { error, reason } = getErrorObj(e.data);
        assert.equal(error, 'revert');
        assert.equal(reason, "PaymentSplitter: account is not due payment");
      }
    });
  });

  /// Test migration functionality: that it can only be migrated once,
  /// that contributor/contribution data is migrated correctly, and
  /// that the balance is transferred
  describe("migration", () => {
    it("can only be migrated once", async () => {
      const contributors = [account4, account5];
      const contributions = [10, 20];
      try {
        await instance.migrateData(contributors, contributions);
        await instance.migrateData(contributors, contributions);
      } catch (e) {
        const { error, reason } = getErrorObj(e.data);
        assert.equal(error, 'revert');
        assert.equal(reason, "Contract has already been migrated");
      }
    });

    it("correctly migrates contribution data if caller is the owner", async () => {
      await instance.makePayment.sendTransaction({ from: account4, value: toWei("2") });
      await instance.makePayment.sendTransaction({ from: account5, value: toWei("3") });

      const contributors = await instance.getContributorAddresses();
      const contributions = [];
      contributors.forEach(async c => contributions.push(await instance.getAccountContribution(c)));
      
      const updated = await createNewContract();
      await updated.migrateData(contributors, contributions);
      const newContributors = await updated.getContributorAddresses();

      assert.deepEqual(contributors, newContributors);

      const newContributions = [];
      newContributors.forEach(async c => newContributions.push(await updated.getAccountContribution(c)));

      const contributionOriginal = new BN(await instance.getAccountContribution(contributors[0])).toString();
      const contributionMigrated = new BN(await updated.getAccountContribution(newContributors[0])).toString();
      assert.equal(contributionOriginal, contributionMigrated)
    });

    it("throws an error when migrating data if caller is not the owner", async () => {
      const updated = await createNewContract();
      try {
        await updated.migrateData([],[], { from: account4 });
      } catch (e) {
        const { error, reason } = getErrorObj(e.data);
        assert.equal(error, 'revert');
        assert.equal(reason, "Ownable: caller is not the owner");
      }
    })

    it("correctly transfers balance if caller is the owner", async () => {
      await instance.makePayment.sendTransaction({ from: account4, value: toWei("2") });
      await instance.makePayment.sendTransaction({ from: account5, value: toWei("3") });
      const balance = await getBalance(instance.address);

      const updated = await createNewContract();

      await instance.transferBalance(updated.address, { from: owner });
      const transferredBalance = await getBalance(updated.address);

      assert.equal(balance, transferredBalance);
    });

    it("operates as expected when there is no balance", async () => {
      const balance = await getBalance(instance.address);

      const updated = await createNewContract();

      await instance.transferBalance(updated.address, { from: owner });
      const transferredBalance = await getBalance(updated.address);

      assert.equal(balance, transferredBalance);
    });

    it("throws an error when transferring balance if caller is not the owner", async () => {
      const updated = await createNewContract();
      try {
        await instance.transferBalance(updated.address, { from: account4 });
      } catch (e) {
        const { error, reason } = getErrorObj(e.data);
        assert.equal(error, 'revert');
        assert.equal(reason, "Ownable: caller is not the owner");
      }
    });

  });
});
