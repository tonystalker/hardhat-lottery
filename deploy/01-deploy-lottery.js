const { developmentChains, networkConfig } = require("../helper-hardhat-config")

const { verify } = require("../utils/verify")

const VRF_SUB_FUND_AMOUNT = ethers.parseEther("30")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let vrfCoordinatorV2Address, subscriptionId

    if (chainId == 31337) {
        //create vrf subscription
        const vrfCoordinatorV2Mock = await ethers.getContract(
            " VRFCoordinatorV2MockCoordinatorV2Mock",
        )
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait()
        subscriptionId = transactionReceipt.events[0].args.subId
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[network.config.chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[network.config.chainId]["subscriptionId"]
    }
    const entranceFee = networkConfig[network.config.chainId]["entranceFee"]
    const gasLane = networkConfig[network.config.chainId]["gasLane"]
    const callbackGasLimit = networkConfig[network.config.chainId]["callbackGasLimit"]
    const keepersUpdateInterval = networkConfig[network.config.chainId]["keepersUpdateInterval"]
    const args = [
        vrfCoordinatorV2Address,
        entranceFee,
        gasLane,
        subscriptionId,
        callbackGasLimit,
        keepersUpdateInterval,
    ]
    const lottery = await deploy("Lottery", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying contract on etherscan...")
        await verify(lottery.address, args)
    }
    log("_________________________________________")
}
module.exports.tags = ["all", "lottery"]
