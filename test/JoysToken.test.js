const JoysToken = artifacts.require('JoysToken');

contract('JoysToken', ([alice]) => {
    beforeEach(async () => {
        this.joys = await JoysToken.new({ from: alice });
    });

    it('should have correct name and symbol and decimal', async () => {
        const name = await this.joys.name();
        const symbol = await this.joys.symbol();
        const decimals = await this.joys.decimals();
        const owner = await this.joys.owner();
        const supply = await this.joys.totalSupply();
        assert.equal(name.valueOf(), 'JoysToken');
        assert.equal(symbol.valueOf(), 'JOYS');
        assert.equal(decimals.valueOf(), '18');
        assert.equal(owner.valueOf(), alice);
        assert.equal(supply.toString(), 300000000*1e18.toString());
    });
  });
