const { ethers } = require("hardhat")
const networkConfig = {
    default: {
        name: "hardhat",
        keepersUpdateInterval: "30",
    },
    11155111: {
        name: "sepolia",
        subscriptionId: "0",
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
        keepersUpdateInterval: "30",
        callbackGasLimit: "500000", // 500,000 gas*/
        vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
        entranceFee: ethers.parseEther("0.01"),
    },
    31337: {
        name: "localhost",
        entranceFee: ethers.parseEther("0.01"),
        keepersUpdateInterval: "30",
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
    },
}
const developmentChains = ["hardhat", "localhost"]
module.exports = { developmentChains, networkConfig }
