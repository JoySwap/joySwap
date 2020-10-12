const { expectRevert, time } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const JoysToken = artifacts.require('JoysToken');
const JoysTokenCrowdsale = artifacts.require('JoysTokenCrowdsale');

contract('JoysTokenCrowdsale', ([alice, bob, dev, crowd, crowdsale, ethRecever]) => {
    beforeEach(async () => {
        this.joys = await JoysToken.new({ from: alice });
    });

    it('should ok', async () => {
        // const joysCrowd = 2400 * 1e18.toString()
        const supply = '300000000000000000000000000';
        const cap = '2400000000000000000000';
        var joysCrowd = web3.utils.toBN(cap).toString();
        var joysSupply = web3.utils.toBN(supply).toString();

        assert.equal(await this.joys.owner().valueOf(), alice);

        assert.equal(await (this.joys.balanceOf(alice)).valueOf(), joysSupply);

        const rate = 10000;
        const start = (await time.latest()).add(time.duration.seconds(30));
        const close = start.add(time.duration.minutes(15));
        this.crowd = await JoysTokenCrowdsale.new(
            rate,
            ethRecever,              // crowd eth receiver
            this.joys.address,      // joys token holder
            cap,
            start, close, { from: alice });

        // 给crowdContract 转2400w
        await this.joys.transfer(this.crowd.address, joysCrowd, {from: alice});
        assert.equal(await (this.joys.balanceOf(this.crowd.address)).valueOf(), joysCrowd);

        // transfer ownership
        this.joys.transferOwnership(this.crowd.address, {from:alice});
        assert.equal(await this.joys.owner().valueOf(), this.crowd.address);


        /*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
        *||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
        *||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
        *||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
        * */
        // test1 crowd open state
        // assert.fail(await this.crowd.isOpen(), "should not open");
        await time.increase(time.duration.seconds(35));
        assert.ok(await this.crowd.isOpen(), "should open");

        // buy tokens
        assert.ok(
            await this.crowd.buyTokens(bob, {value: web3.utils.toWei('1', 'wei'), from: bob}),
            // await this.crowd.buyTokens(bob, {value: web3.utils.fromWei('1'), from: bob}),
            "amount more than 1eth"
        );

        // await this.crowd.buyTokens(bob, {value: web3.utils.toWei('2.1', 'wei'), from: bob});
        // assert.equal( (await this.crowd.weiRaised()).valueOf(), '2.1');
        // assert.equal( (await web3.eth.getBalance(dev)).valueOf(), '2.1');
        // assert.equal( (await this.joys.balanceOf(bob)).valueOf(), '21000');
        //
        // // assert.equal( await web3.eth.getBalance(dev).valueOf(), amount.toString());
        // // expect(await web3.eth.getBalance(dev)).valueOf().to.eql(amount.toString());

        // assert.equal(this.crowd.hasClosed(), false);
        expectRevert(await this.crowd.burn(), "not closed");

        time.increase(time.duration.minutes(16));
        // assert.equal(this.crowd.isOpen(), true);

        // change crowd/joys ownership
        // joys ownership may wrong??
        await this.crowd.transferOwnership(dev, {from: alice});
        assert.equal(await this.joys.owner().valueOf(), dev);
    });

});