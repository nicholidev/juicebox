const { ethers } = require("hardhat");
const { expect } = require("chai");

const tests = {
  success: [
    {
      description: "set one payment mod, called by owner, max percent",
      fn: ({ deployer }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        mods: [
          {
            allocator: ethers.constants.AddressZero,
            projectId: 1,
            beneficiary: deployer.address,
            percent: 200,
            note: "sup",
            preferUnstaked: false,
            lockedUntil: 0
          }
        ]
      })
    },
    {
      description: "set one payment mod, beneficiary is different from caller",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        mods: [
          {
            allocator: ethers.constants.AddressZero,
            projectId: 1,
            beneficiary: addrs[0].address,
            percent: 200,
            note: "sup",
            preferUnstaked: false,
            lockedUntil: 0
          }
        ]
      })
    },
    {
      description: "set many payment mods, called by owner",
      fn: ({ deployer, modAllocator }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        mods: [
          {
            allocator: ethers.constants.AddressZero,
            projectId: 1,
            beneficiary: deployer.address,
            percent: 100,
            note: "sup",
            preferUnstaked: false,
            lockedUntil: 0
          },
          {
            allocator: modAllocator.address,
            projectId: 2,
            beneficiary: ethers.constants.AddressZero,
            percent: 50,
            note: "",
            preferUnstaked: false,
            lockedUntil: 0
          }
        ]
      })
    },
    {
      description: "set one payment mod, called by operator",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        projectOwner: addrs[0].address,
        projectId: 1,
        configuration: 10,
        permissionFlag: true,
        mods: [
          {
            allocator: ethers.constants.AddressZero,
            projectId: 1,
            beneficiary: deployer.address,
            percent: 100,
            note: "sup",
            preferUnstaked: false,
            lockedUntil: 0
          }
        ]
      })
    },
    {
      description: "lock passed",
      fn: ({ deployer, testStart }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        setup: {
          projectId: 1,
          configuration: 10,
          mods: [
            {
              allocator: ethers.constants.AddressZero,
              projectId: 4,
              beneficiary: deployer.address,
              percent: 100,
              note: "sup",
              preferUnstaked: false,
              lockedUntil: testStart.add(10)
            }
          ],
          fastforward: ethers.BigNumber.from(10)
        },
        mods: [
          {
            allocator: ethers.constants.AddressZero,
            projectId: 4,
            beneficiary: deployer.address,
            // different properties.
            percent: 200,
            note: "sup",
            preferUnstaked: false,
            lockedUntil: 0
          }
        ]
      })
    },
    {
      description:
        "lock and included with different unstaked preferences and note",
      fn: ({ deployer, testStart }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        setup: {
          projectId: 1,
          configuration: 10,
          mods: [
            {
              allocator: ethers.constants.AddressZero,
              projectId: 4,
              beneficiary: deployer.address,
              percent: 100,
              note: "sup",
              preferUnstaked: true,
              lockedUntil: testStart.add(10)
            }
          ],
          fastforward: ethers.BigNumber.from(9)
        },
        mods: [
          {
            allocator: ethers.constants.AddressZero,
            projectId: 4,
            beneficiary: deployer.address,
            percent: 100,
            note: "wassup",
            preferUnstaked: false,
            lockedUntil: testStart.add(10)
          },
          {
            allocator: ethers.constants.AddressZero,
            projectId: 2,
            beneficiary: deployer.address,
            percent: 100,
            note: "pasta",
            preferUnstaked: false,
            lockedUntil: 0
          }
        ]
      })
    },
    {
      description: "not locked if different configuration",
      fn: ({ deployer, addrs, testStart }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        setup: {
          projectId: 1,
          configuration: 11,
          mods: [
            {
              beneficiary: addrs[0].address,
              allocator: ethers.constants.AddressZero,
              projectId: 2,
              percent: 50,
              note: "",
              preferUnstaked: false,
              lockedUntil: testStart.add(10)
            }
          ],
          fastforward: ethers.BigNumber.from(8)
        },
        mods: [
          {
            beneficiary: deployer.address,
            allocator: ethers.constants.AddressZero,
            projectId: 2,
            percent: 50,
            note: "",
            preferUnstaked: false,
            lockedUntil: testStart.add(10)
          }
        ]
      })
    },
    {
      description: "not locked if different project",
      fn: ({ deployer, addrs, testStart }) => ({
        caller: deployer,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        setup: {
          projectId: 11,
          configuration: 10,
          mods: [
            {
              beneficiary: addrs[0].address,
              allocator: ethers.constants.AddressZero,
              projectId: 2,
              percent: 50,
              note: "",
              preferUnstaked: false,
              lockedUntil: testStart.add(10)
            }
          ],
          fastforward: ethers.BigNumber.from(8)
        },
        mods: [
          {
            beneficiary: deployer.address,
            allocator: ethers.constants.AddressZero,
            projectId: 2,
            percent: 50,
            note: "",
            preferUnstaked: false,
            lockedUntil: testStart.add(10)
          }
        ]
      })
    }
  ],
  failure: [
    {
      description: "unauthorized",
      fn: ({ deployer, addrs }) => ({
        caller: deployer,
        controller: addrs[0].address,
        projectOwner: addrs[0].address,
        projectId: 1,
        configuration: 10,
        mods: [],
        permissionFlag: false,
        revert: "Operatable: UNAUTHORIZED"
      })
    },
    {
      description: "no mods",
      fn: ({ deployer }) => ({
        caller: deployer,
        controller: deployer.address,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        mods: [],
        revert: "ModStore::setPaymentMods: NO_OP"
      })
    },
    {
      description: "no allocator or beneficiary",
      fn: ({ deployer }) => ({
        caller: deployer,
        controller: deployer.address,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        mods: [
          {
            allocator: ethers.constants.AddressZero,
            projectId: 1,
            beneficiary: ethers.constants.AddressZero,
            percent: 100,
            note: "sup",
            preferUnstaked: false,
            lockedUntil: 0
          }
        ],
        revert: "ModStore::setPaymentMods: ZERO_ADDRESS"
      })
    },
    {
      description: "mod percent over 100%",
      fn: ({ deployer }) => ({
        caller: deployer,
        controller: deployer.address,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        mods: [
          {
            allocator: ethers.constants.AddressZero,
            projectId: 1,
            beneficiary: deployer.address,
            percent: 210,
            note: "sup",
            preferUnstaked: false,
            lockedUntil: 0
          },
          {
            allocator: ethers.constants.AddressZero,
            projectId: 2,
            beneficiary: deployer.address,
            percent: 50,
            note: "",
            preferUnstaked: false,
            lockedUntil: 0
          }
        ],
        revert: "ModStore::setPaymentMods: BAD_TOTAL_PERCENT"
      })
    },
    {
      description: "mod percent is 0%",
      fn: ({ deployer }) => ({
        caller: deployer,
        controller: deployer.address,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        mods: [
          {
            allocator: ethers.constants.AddressZero,
            projectId: 1,
            beneficiary: deployer.address,
            percent: 0,
            note: "sup",
            preferUnstaked: false,
            lockedUntil: 0
          },
          {
            allocator: ethers.constants.AddressZero,
            projectId: 2,
            beneficiary: deployer.address,
            percent: 50,
            note: "",
            preferUnstaked: false,
            lockedUntil: 0
          }
        ],
        revert: "ModStore::setPaymentMods: BAD_MOD_PERCENT"
      })
    },
    {
      description: "total percents over 100%",
      fn: ({ deployer }) => ({
        caller: deployer,
        controller: deployer.address,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        mods: [
          {
            allocator: ethers.constants.AddressZero,
            projectId: 1,
            beneficiary: deployer.address,
            percent: 180,
            note: "sup",
            preferUnstaked: false,
            lockedUntil: 0
          },
          {
            allocator: ethers.constants.AddressZero,
            projectId: 2,
            beneficiary: deployer.address,
            percent: 50,
            note: "",
            preferUnstaked: false,
            lockedUntil: 0
          }
        ],
        revert: "ModStore::setPaymentMods: BAD_TOTAL_PERCENT"
      })
    },
    {
      description: "locked with different beneficiaries",
      fn: ({ deployer, addrs, testStart }) => ({
        caller: deployer,
        controller: deployer.address,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        setup: {
          projectId: 1,
          configuration: 10,
          mods: [
            {
              beneficiary: addrs[0].address,
              allocator: ethers.constants.AddressZero,
              projectId: 2,
              percent: 50,
              note: "",
              preferUnstaked: false,
              lockedUntil: testStart.add(10)
            }
          ],
          fastforward: ethers.BigNumber.from(8)
        },
        mods: [
          {
            beneficiary: deployer.address,
            allocator: ethers.constants.AddressZero,
            projectId: 2,
            percent: 50,
            note: "",
            preferUnstaked: false,
            lockedUntil: testStart.add(10)
          }
        ],
        revert: "ModStore::setPaymentMods: SOME_LOCKED"
      })
    },
    {
      description: "locked with different percents",
      fn: ({ deployer, testStart }) => ({
        caller: deployer,
        controller: deployer.address,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        setup: {
          projectId: 1,
          configuration: 10,
          mods: [
            {
              percent: 200,
              beneficiary: deployer.address,
              allocator: ethers.constants.AddressZero,
              projectId: 2,
              note: "",
              preferUnstaked: false,
              lockedUntil: testStart.add(10)
            }
          ],
          fastforward: ethers.BigNumber.from(8)
        },
        mods: [
          {
            percent: 100,
            beneficiary: deployer.address,
            allocator: ethers.constants.AddressZero,
            projectId: 2,
            note: "",
            preferUnstaked: false,
            lockedUntil: testStart.add(10)
          }
        ],
        revert: "ModStore::setPaymentMods: SOME_LOCKED"
      })
    },
    {
      description: "locked with different allocators",
      fn: ({ deployer, modAllocator, testStart }) => ({
        caller: deployer,
        controller: deployer.address,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        setup: {
          projectId: 1,
          configuration: 10,
          mods: [
            {
              percent: 200,
              beneficiary: deployer.address,
              allocator: modAllocator.address,
              projectId: 2,
              note: "",
              preferUnstaked: false,
              lockedUntil: testStart.add(10)
            }
          ],
          fastforward: ethers.BigNumber.from(8)
        },
        mods: [
          {
            percent: 200,
            beneficiary: deployer.address,
            allocator: ethers.constants.AddressZero,
            projectId: 2,
            note: "",
            preferUnstaked: false,
            lockedUntil: testStart.add(10)
          }
        ],
        revert: "ModStore::setPaymentMods: SOME_LOCKED"
      })
    },
    {
      description: "locked with different project",
      fn: ({ deployer, testStart }) => ({
        caller: deployer,
        controller: deployer.address,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        setup: {
          projectId: 1,
          configuration: 10,
          mods: [
            {
              percent: 200,
              beneficiary: deployer.address,
              allocator: ethers.constants.AddressZero,
              projectId: 2,
              note: "",
              preferUnstaked: false,
              lockedUntil: testStart.add(10)
            }
          ],
          fastforward: ethers.BigNumber.from(8)
        },
        mods: [
          {
            percent: 200,
            beneficiary: deployer.address,
            allocator: ethers.constants.AddressZero,
            projectId: 3,
            note: "",
            preferUnstaked: false,
            lockedUntil: testStart.add(10)
          }
        ],
        revert: "ModStore::setPaymentMods: SOME_LOCKED"
      })
    },
    {
      description: "locked with shorter locked until values",
      fn: ({ deployer, testStart }) => ({
        caller: deployer,
        controller: deployer.address,
        projectOwner: deployer.address,
        projectId: 1,
        configuration: 10,
        setup: {
          projectId: 1,
          configuration: 10,
          mods: [
            {
              percent: 100,
              beneficiary: deployer.address,
              allocator: ethers.constants.AddressZero,
              projectId: 2,
              note: "",
              preferUnstaked: false,
              lockedUntil: testStart.add(10)
            }
          ],
          fastforward: ethers.BigNumber.from(8)
        },
        mods: [
          {
            percent: 100,
            beneficiary: deployer.address,
            allocator: ethers.constants.AddressZero,
            projectId: 2,
            note: "",
            preferUnstaked: false,
            lockedUntil: testStart.add(9)
          }
        ],
        revert: "ModStore::setPaymentMods: SOME_LOCKED"
      })
    }
  ]
};

module.exports = function() {
  describe("Success cases", function() {
    tests.success.forEach(function(successTest) {
      it(successTest.description, async function() {
        const {
          caller,
          projectOwner,
          projectId,
          configuration,
          mods,
          setup,
          permissionFlag
        } = successTest.fn(this);

        // Set the Projects mock to return the projectOwner.
        await this.projects.mock.ownerOf
          .withArgs(projectId)
          .returns(projectOwner);

        // Mock the caller to be the project's controller.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(caller.address);

        // If a permission flag is specified, set the mock to return it.
        if (permissionFlag !== undefined) {
          // Get the permission index needed to set the payment mods on an owner's behalf.
          const permissionIndex = 13;

          // Set the Operator store to return the permission flag.
          await this.operatorStore.mock.hasPermission
            .withArgs(caller.address, projectOwner, projectId, permissionIndex)
            .returns(permissionFlag);
        }

        if (setup) {
          if (setup.mods) {
            if (setup.projectId !== projectId) {
              // Set the Projects mock to return the projectOwner.
              await this.projects.mock.ownerOf
                .withArgs(setup.projectId)
                .returns(projectOwner);

              // Mock the caller to be the project's controller for setup.
              await this.terminalDirectory.mock.terminalOf
                .withArgs(setup.projectId)
                .returns(caller.address);
            }
            // Execute the transaction.
            await this.contract
              .connect(caller)
              .setPaymentMods(setup.projectId, setup.configuration, setup.mods);
          }
          if (setup.fastforward) {
            // Fast forward the clock if needed.
            // Subtract 1 so that the next operations mined block is likely to fall on the intended timestamp.
            // eslint-disable-next-line no-await-in-loop
            await this.fastforward(setup.fastforward.sub(1));
          }
        }

        // Execute the transaction.
        const tx = await this.contract
          .connect(caller)
          .setPaymentMods(projectId, configuration, mods);

        // Get the stored payment mods value.
        const storedProjectMods = await this.contract.paymentModsOf(
          projectId,
          configuration
        );

        // Expect an event to have been emitted for each mod.
        await Promise.all(
          storedProjectMods.map(mod =>
            expect(tx)
              .to.emit(this.contract, "SetPaymentMod")
              .withArgs(projectId, configuration, mod, caller.address)
          )
        );

        // Expect there to be the same number of stored mods.
        expect(mods.length).equal(storedProjectMods.length);

        // Expect the stored mods values to match.
        mods.forEach((mod, i) => {
          expect(storedProjectMods[i].allocator).to.equal(mod.allocator);
          expect(storedProjectMods[i].beneficiary).to.equal(mod.beneficiary);
          expect(storedProjectMods[i].percent).to.equal(mod.percent);
          expect(storedProjectMods[i].preferUnstaked).to.equal(
            mod.preferUnstaked
          );
          expect(storedProjectMods[i].projectId).to.equal(mod.projectId);
          expect(storedProjectMods[i].lockedUntil).to.equal(mod.lockedUntil);
        });
      });
    });
  });
  describe("Failure cases", function() {
    tests.failure.forEach(function(failureTest) {
      it(failureTest.description, async function() {
        const {
          caller,
          controller,
          projectOwner,
          projectId,
          configuration,
          mods,
          permissionFlag,
          setup,
          revert
        } = failureTest.fn(this);

        await this.projects.mock.ownerOf
          .withArgs(projectId)
          .returns(projectOwner);

        // Mock the caller to be the project's controller for setup.
        await this.terminalDirectory.mock.terminalOf
          .withArgs(projectId)
          .returns(controller);

        if (permissionFlag !== undefined) {
          const permissionIndex = 13;

          await this.operatorStore.mock.hasPermission
            .withArgs(caller.address, projectOwner, projectId, permissionIndex)
            .returns(permissionFlag);
        }
        if (setup) {
          if (setup.mods) {
            await this.contract
              .connect(caller)
              .setPaymentMods(setup.projectId, setup.configuration, setup.mods);
          }
          if (setup.fastforward) {
            await this.fastforward(setup.fastforward.sub(1));
          }
        }

        await expect(
          this.contract
            .connect(caller)
            .setPaymentMods(projectId, configuration, mods)
        ).to.be.revertedWith(revert);
      });
    });
  });
};
