const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "appoint",
      fn: ({ addrs, governance }) => ({
        caller: governance,
        governance: addrs[0]
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ governance }) => ({
        caller: governance,
        revert: "Juicer::acceptGovernance: UNAUTHORIZED"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const { caller, governance } = successTest.fn(this);

        // Appoint the governance that will accept.
        await this.contract
          .connect(caller)
          .appointGovernance(governance.address);

        // Execute the transaction.
        const tx = await this.contract.connect(governance).acceptGovernance();

        // Expect an event to have been emitted.
        await expect(tx)
          .to.emit(this.contract, "AcceptGovernance")
          .withArgs(governance.address);

        // Get the stored pending governance value.
        const storedGovernance = await this.contract.governance();

        // Expect the stored value to equal whats expected.
        expect(storedGovernance).to.equal(governance.address);
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const { caller, revert } = failureTest.fn(this);

        await expect(
          this.contract.connect(caller).acceptGovernance()
        ).to.be.revertedWith(revert);
      });
    });
  });
};
