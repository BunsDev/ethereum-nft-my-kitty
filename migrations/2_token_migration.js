const MyKitty = artifacts.require("MyKitty");

module.exports = function (deployer) {
  deployer.deploy(MyKitty);
};
