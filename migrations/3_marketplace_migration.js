const MyKitty = artifacts.require("MyKitty");
const KittyMarketplace = artifacts.require("KittyMarketplace");

module.exports = function (deployer) {
  deployer.deploy(KittyMarketplace, MyKitty.address);
};
