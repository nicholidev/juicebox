const { BigNumber, constants, utils } = require("ethers");
const workflows = require("./workflows");

const run = function(ops) {
  return async function() {
    // Bind this.
    this.ops = ops;
    const resolvedOps = await this.ops(this);

    // eslint-disable-next-line no-restricted-syntax
    for (const op of resolvedOps) {
      this.local = {
        ...this.local,
        // eslint-disable-next-line no-await-in-loop
        ...(await op(this))
      };
    }
  };
};

module.exports = function() {
  // Deploy all contracts.
  before(async function() {
    const operatorStore = await this.deployContractFn("OperatorStore");
    const projects = await this.deployContractFn("Projects", [
      operatorStore.address
    ]);
    const prices = await this.deployContractFn("Prices");
    const terminalDirectory = await this.deployContractFn("TerminalDirectory", [
      projects.address
    ]);
    const fundingCycles = await this.deployContractFn("FundingCycles", [
      terminalDirectory.address
    ]);

    const ticketBooth = await this.deployContractFn("TicketBooth", [
      projects.address,
      operatorStore.address,
      terminalDirectory.address
    ]);

    const modStore = await this.deployContractFn("ModStore", [
      projects.address,
      operatorStore.address,
      terminalDirectory.address
    ]);

    const governance = await this.deployContractFn("Governance", [
      1,
      terminalDirectory.address
    ]);

    const juicer = await this.deployContractFn("Juicer", [
      projects.address,
      fundingCycles.address,
      ticketBooth.address,
      operatorStore.address,
      modStore.address,
      prices.address,
      terminalDirectory.address,
      governance.address
    ]);

    // Set governance as the prices contract owner.
    await prices.transferOwnership(governance.address);
    /** 
      Deploy the governance contract's project. It will have an ID of 1.
    */
    await this.executeFn({
      caller: this.deployer,
      contract: juicer,
      fn: "deploy",
      args: [
        this.deployer.address,
        utils.formatBytes32String("juice"),
        "",
        {
          target: 0,
          currency: 0,
          duration: BigNumber.from(10000),
          discountRate: BigNumber.from(180),
          ballot: constants.AddressZero
        },
        {
          reservedRate: 0,
          bondingCurveRate: 0,
          reconfigurationBondingCurveRate: 0
        },
        [],
        []
      ]
    });

    // Bind the contracts to give the wokflows access to them.
    this.contracts = {
      governance,
      terminalDirectory,
      prices,
      operatorStore,
      ticketBooth,
      fundingCycles,
      projects,
      modStore,
      juicer
    };

    // Bind the standard weight multiplier to the constants.
    // This is used to determine how many tickets get printed per value contributed during a first funding cycle.
    this.constants.InitialWeightMultiplier = (
      await fundingCycles.BASE_WEIGHT()
    ).div(BigNumber.from(10).pow(18));
  });

  for (let i = 0; i < 1; i += 1) {
    it(
      "Projects can be created, have their URIs changed, transfer/claim handles, and be attached to funding cycles",
      run(workflows.projects)
    );
    it(
      "Deployment of a project with funding cycles and mods included",
      run(workflows.deploy)
    );
    it("Redeem tickets for overflow", run(workflows.redeem));
    it("Prints reserved tickets", run(workflows.printReservedTickets));
    it("Issues tickets and honors preference", run(workflows.issueTickets));
    it("Reconfigures a project", run(workflows.reconfigure));
    it(
      "Ballot must be approved for reconfiguration to become active",
      run(workflows.approvedBallot)
    );
    it(
      "Reconfiguration that fails a ballot should be ignored",
      run(workflows.failedBallot)
    );
    it("Migrate from one Terminal to another", run(workflows.migrate));
    it("Tap funds up to the configured target", run(workflows.tap));
    it(
      "Operators can be given permissions",
      run(workflows.operatorPermissions)
    );
    it(
      "Set and update payout mods, honoring locked status",
      run(workflows.setPaymentMods)
    );
    it(
      "Set and update ticket mods, honoring locked status",
      run(workflows.setTicketMods)
    );
    it(
      "A new governance can be appointed and accepted",
      run(workflows.governance)
    );
    it(
      "Governance can set a new fee for future configurations",
      run(workflows.setFee)
    );
    it(
      "Projects can print premined tickets before a payment has been made to it",
      run(workflows.printPreminedTickets)
    );
    it(
      "Currencies rates are converted to/from correctly",
      run(workflows.currencyConversion)
    );
    it(
      "Transfer ownership over a project",
      run(workflows.transferProjectOwnership)
    );
    it(
      "Direct payment addresses can be deployed to add an fundable address to a project.",
      run(workflows.directPaymentAddresses)
    );
  }
};
