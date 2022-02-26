pragma solidity >=0.4.22 <0.9.0;

contract Contacts {
    uint256 public count = 0;

    struct customer {
        uint256 id;
        uint256 balance;
        address payable userAddress;
    }

    mapping(address => customer) public accounts;

    event transferal(address from, address to, uint256 amount);
    event deposital(address user, uint256 amount);
    event withdrawal(address user, uint256 amount);

    // --------------- Function --------------- //
    function createAccount() public {
        count++;
        accounts[msg.sender].id = count;
        accounts[msg.sender].balance = 1000;
        accounts[msg.sender].userAddress = msg.sender;
    }

    function transfer(address payable to, uint256 amount) public {
        to.transfer(amount);
        accounts[msg.sender].balance -= amount;
        emit transferal(msg.sender, to, amount);
    }

    function deposit(uint256 amount) public payable {
        accounts[msg.sender].balance += amount;
        emit deposital(msg.sender, msg.value);
    }

    function withdraw(uint256 amounts) public payable {
        // msg.sender.transfer(amounts);
        accounts[msg.sender].balance -= amounts;
        emit withdrawal(msg.sender, msg.value);
    }

    function getBalance() public view returns (uint256) {
        return (accounts[msg.sender].balance);
    }

    function getAddress() public view returns (address) {
        return (accounts[msg.sender].userAddress);
    }

    // --------------- Function --------------- //
}
