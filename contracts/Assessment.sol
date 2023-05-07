// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;
        balance += _amount;
        assert(balance == _previousBalance + _amount);
        emit Deposit(_amount);  // emit the event
    }

   
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount); // custom error

    function withdraw(uint256 _withdrawAmount) public {
        
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }
     
        balance -= _withdrawAmount; //withdraw amount
        assert(balance == (_previousBalance - _withdrawAmount));
        emit Withdraw(_withdrawAmount);         // emit the event
    }
}
