const JoysToken = artifacts.require('JoysToken');

module.exports = function(deployer) {
    token = deployer.deploy(JoysToken);
};
