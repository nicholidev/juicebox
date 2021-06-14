const shouldBehaveLike = require("./behaviors");

const contractName = "Governance";

module.exports = function() {
  // Before the tests, deploy the contract.
  before(async function() {
    this.projectId = 1;

    // Deploy the contract.
    this.contract = await this.deployContract(contractName, [this.projectId]);
  });

  // Test each function.
  describe("allowMigration(...)", shouldBehaveLike.allowMigration);
  describe("setYielder(...)", shouldBehaveLike.setYielder);
  describe("addPriceFeed(...)", shouldBehaveLike.addPriceFeed);
  describe("setTargetLocalEth(...)", shouldBehaveLike.setTargetLocalEth);
  describe("setFee(...)", shouldBehaveLike.setFee);
  describe("appointGovernance(...)", shouldBehaveLike.appointGovernance);
};
