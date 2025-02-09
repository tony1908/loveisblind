// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Staking is ERC20 {
    // Mapping to track staking balance for each address
    mapping(address => uint256) public stakes;
    // Total amount staked in the contract
    uint256 public totalStaked;

    // Events for logging staking and unstaking actions
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);

    // Initialize the ERC20 token with a name and symbol
    constructor() ERC20("Love is Blind Token", "LIBT") {
        // Mint 1 billion tokens to the contract's reserve (taking decimals into account)
        _mint(address(this), 1000000000 * 10 ** decimals());
    }

    // Allow users to stake by sending Ether in a transaction
    function stake() public payable {
        require(msg.value > 0, "Must stake a positive amount");
        // Increase user balance and overall stake total
        stakes[msg.sender] += msg.value;
        totalStaked += msg.value;

        // Calculate the number of full tokens: 1 full token per 1 native token staked.
        uint256 nativeUnit = 10 ** 18; // assuming 18 decimals for the native token
        uint256 fullTokens = msg.value / nativeUnit;
        require(fullTokens > 0, "Must stake at least 1 native token for a full token reward");
        uint256 tokenAmount = fullTokens * 10 ** decimals();

        // Ensure the reserve has enough tokens
        require(balanceOf(address(this)) >= tokenAmount, "Reserve insufficient for token reward");
        _transfer(address(this), msg.sender, tokenAmount);

        emit Staked(msg.sender, msg.value);
    }

    // Unstake a specified amount of Ether
    function unstake(uint256 amount) public {
        require(stakes[msg.sender] >= amount, "Insufficient staked balance");
        // Update the user's balance and total staked amount BEFORE transferring to prevent reentrancy
        stakes[msg.sender] -= amount;
        totalStaked -= amount;

        // Transfer the Ether back to the user using call
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        emit Unstaked(msg.sender, amount);
    }

    // Allow the contract to receive Ether directly.
    // Ether sent directly will be recorded as a stake.
    receive() external payable {
        stake();
    }

    // Function to check the staked amount for a given user
    function getStakedBalance(address user) public view returns (uint256) {
        return stakes[user];
    }
} 