const Token = artifacts.require('Token')
const EthSwap = artifacts.require('EthSwap');

require('chai')
	.use(require('chai-as-promised'))
	.should()

function tokens(n) {
	return web3.utils.toWei(n, 'ether')
}

contract('EthSwap', ([deployer, investor]) => {

	let token, ethSwap

	before(async() => {
		token = await Token.new()		
		ethSwap = await EthSwap.new(token.address)
		//Transfer all tokens to EthSwap
		await token.transfer(ethSwap.address, tokens('1000000'))
	})

	describe('Token deployement', async() => {
		it('contract has a name', async() => {
			const name = await token.name()
			assert.equal(name, 'DApp Token')
		})
	})

	describe('EthSwap deployement', async() => {
		it('contract has a name', async() => {
			const name = await ethSwap.name()
			assert.equal(name, 'EthSwap Instant Exchange')
		})

		it('contract has tokens', async() => {
			const balance = await token.balanceOf(ethSwap.address)
			assert.equal(balance.toString(), tokens('1000000'))
		})
	})

	describe('buyTokens()', async() => {
		
		let result
		before(async() => {
			// Purchase tokens before each example
			result = await ethSwap.buyTokens({ from: investor, value: tokens('1')})
		})

		it('Allows user to instantly purchase tokens from ethSwap for a fixed price', async() => {
			// Check investor token balance after purchase
			let investorBalance = await token.balanceOf(investor)
			const rate = await ethSwap.rate()
			assert.equal(investorBalance.toString(), tokens(rate))

			//Check ethSwap token balance after purchase
			let ethSwapTokenBalance = await token.balanceOf(ethSwap.address)
			assert.equal(ethSwapTokenBalance.toString(), tokens('999900'))
			//Check ethSwap eth balance after purchase
			let ethSwapEthBalance = await web3.eth.getBalance(ethSwap.address)
			assert.equal(ethSwapEthBalance.toString(), web3.utils.toWei('1', 'ether'))

			const event = result.logs[0].args
			assert.equal(event.account, investor)
			assert.equal(event.token, token.address)
			assert.equal(event.amount.toString(), tokens('100').toString())
			assert.equal(event.rate.toString(), rate)
		})
	})


	describe('sellTokens()', async() => {
		
		let result
		before(async() => {
			// Investor must approve tokens before the sell
			await token.approve(ethSwap.address, tokens('100'), { from: investor})
			// Investor sells tokens
			result = await ethSwap.sellTokens(tokens('100'), { from: investor})
		})

		it('Allows user to instantly sell tokens to ethSwap for a fixed price', async() => {
			// Check investor token balance after purchase
			let investorBalance = await token.balanceOf(investor)
			const rate = await ethSwap.rate()
			assert.equal(investorBalance.toString(), tokens('0'))

			//Check ethSwap token balance after purchase
			let ethSwapTokenBalance = await token.balanceOf(ethSwap.address)
			assert.equal(ethSwapTokenBalance.toString(), tokens('1000000'))
			//Check ethSwap eth balance after purchase
			let ethSwapEthBalance = await web3.eth.getBalance(ethSwap.address)
			assert.equal(ethSwapEthBalance.toString(), web3.utils.toWei('0', 'ether'))

			const event = result.logs[0].args
			assert.equal(event.account, investor)
			assert.equal(event.token, token.address)
			assert.equal(event.amount.toString(), tokens('100').toString())
			assert.equal(event.rate.toString(), rate)
			
		})
	})



})