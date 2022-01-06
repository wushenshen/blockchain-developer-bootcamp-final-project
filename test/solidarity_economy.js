const SolidarityEconomy = artifacts.require("SolidarityEconomy");

const getErrorObj = (obj = {}) => {
  const txHash = Object.keys(obj)[0];
  return obj[txHash];
}

contract("SolidarityEconomy", (accounts) => {
  const [account0, account1, account2, account3, account4, account5] = accounts;
  const shares = [45, 45, 10];
  const description = "Example description";

  beforeEach(async () => {
    instance = await SolidarityEconomy.new([account1, account2, account3], shares, description);
  });

  describe("Constructor", () => {
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

  describe("makePayment", () => {
    it("correctly tracks contributors and their contributions", async () => {
      await instance.makePayment.sendTransaction({ from: account4, value: 1 });
      assert.equal(await instance.getAmountContributed(account4), 1);
      await instance.makePayment.sendTransaction({ from: account4, value: 2 });
      assert.equal(await instance.getAmountContributed(account4), 3);
      await instance.makePayment.sendTransaction({ from: account5, value: 5 });
      assert.equal(await instance.getAmountContributed(account5), 5);
    });
  });

  describe("release", () => {
    it("correctly release funds to a payee", async () => {
      await instance.makePayment.sendTransaction({ from: account4, value: 10 });
      const balance = await web3.eth.getBalance(instance.address);
      await instance.release(account3);
      const released = await instance.released(account3);
      assert.equal(released, balance * (shares[2]/100));
    });

    it("throws an error if the account is not a payee", async () => {
      try {
        await instance.release(account5);
      } catch (e) {
        const { error, reason } = getErrorObj(e.data);
        assert.equal(error, "revert");
        assert.equal(reason, "PaymentSplitter: account has no shares");
      }
    });

    it("throws an error if there are no funds to release", async () => {
      try {
        await instance.release(account1);
      } catch (e) {
        const { error, reason } = getErrorObj(e.data);
        assert.equal(error, "revert");
        assert.equal(reason, "PaymentSplitter: account is not due payment");
      }
    });
  });
});
