// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "./interfaces/IAdminControlWrapper.sol";
import "./interfaces/IJuicer.sol";
import "./interfaces/IPrices.sol";
import "./interfaces/IBudgetBallot.sol";
import "./abstract/JuiceProject.sol";

/// All functions in here should be governable with FLOW.
/// Owner should eventually change to a governance contract.
contract Admin is JuiceProject {
    constructor(
        IJuicer _juicer,
        string memory _ticketName,
        string memory _ticketSymbol,
        address _pm
    ) JuiceProject(_juicer, _ticketName, _ticketSymbol, _pm) {}

    /** 
      @notice Grants the admin role for a contract that this Admin contract controls.
      @param _contract The contract that is being given access to.
      @param _newAdmin The address that is being given the admin role.
    */
    function grantAdmin(IAdminControlWrapper _contract, address _newAdmin)
        external
        onlyOwner
    {
        _contract.appointAdmin(_newAdmin);
    }

    /** 
      @notice Revokes the admin role for a contract that this Admin contract controls.
      @param _contract The contract that is having access to revoked.
      @param _newAdmin The address that is having the admin role revoked.
    */
    function revokeAdmin(IAdminControlWrapper _contract, address _newAdmin)
        external
        onlyOwner
    {
        _contract.revokeAdmin(_newAdmin);
    }

    /** 
      @notice Revokes the ability for a Juicer to access its Ticket store and Budget stores
      @param _juicer The juicer that is being depcrecated.
    */
    function deprecateJuicer(IJuicer _juicer) external onlyOwner {
        _juicer.ticketStore().revokeAdmin(address(_juicer));
        _juicer.budgetStore().revokeAdmin(address(_juicer));
    }

    /** 
      @notice Gives Ticket holders within one Juicer access to migrate to another Juicer.
      @param _from The juicer to allow a new migration from.
      @param _to The juicer to allow migration to.
    */
    function allowMigration(IJuicer _from, address _to) external onlyOwner {
        _from.allowMigration(address(_to));
    }

    /** 
      @notice Sets a new contract that will yield returns on the juicer's overflow.
      @param _juicer The juicer to change the recalibration target of.
      @param _overflowYielder The new overflow yielder.
    */
    function setOverflowYielder(
        IJuicer _juicer,
        IOverflowYielder _overflowYielder
    ) external onlyOwner {
        _juicer.setOverflowYielder(_overflowYielder);
    }

    /**
        @notice Adds a price feed to a budget store.
        @param _prices The prices contract to add a feed to.
        @param _feed The price feed to add.
        @param _currency The currency the price feed is for.
    */
    function addPriceFeed(
        IPrices _prices,
        AggregatorV3Interface _feed,
        uint256 _currency
    ) external onlyOwner {
        _prices.addFeed(_feed, _currency);
    }

    /**
        @notice Sets the minimum fee that a budget can have.
        @param _budgetStore The budget store to set the mininum fee of.
        @param _fee The new minimum fee.
    */
    function setFee(IBudgetStore _budgetStore, uint256 _fee)
        external
        onlyOwner
    {
        _budgetStore.setFee(_fee);
    }

    /** 
      @notice Sets the budget ballot contract that will be used for forthcoming budget reconfigurations.
      @param _budgetStore The budget store to set the budget ballot of.
      @param _budgetBallot The new budget ballot.
    */
    function setBudgetBallot(
        IBudgetStore _budgetStore,
        IBudgetBallot _budgetBallot
    ) external onlyOwner {
        _budgetStore.setBudgetBallot(_budgetBallot);
    }

    /**
        @notice Set a staker's controller status for an address.
        @param _staker The staker to change the controller status of.
        @param _controller The controller to change the status of.
        @param _status The new status.
    */
    function setControllerStatus(
        ITimelockStaker _staker,
        address _controller,
        bool _status
    ) external onlyOwner {
        _staker.setControllerStatus(_controller, _status);
    }
}
