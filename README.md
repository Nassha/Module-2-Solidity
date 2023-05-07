# Module 2 Intermediate Solidity
# Smart Contract Management

This Solidity program  demonstrates a smart contract that implements three funcitons, getBalance, deposit and withdraw.

## Description

This program contains a contract written in Solidity and provides a graphical user interface through React.js to demonstrate get balance, deposit, and withdraw functions from a Solidity smart contract. 

## Getting Started

### Executing program

To run this program, you can use Visual Studio Code and Hardhat to connect Javascript and Solidity programs.


```javascript
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

```
To execute the given files, enter npx hardhat node in your first terminal, npx hardhat run --network localhost scripts/deploy.js in your second termninal, and npm run dev in your third terminal
The project will be running on your localhost; typically at http://localhost:3000/

## Authors

Nathalie





