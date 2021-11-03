import React, { Component } from 'react'
import tokenLogo from '../token-logo.png'
import ethLogo from '../eth-logo.png'

class BuyForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      input: '',
      output: ''
    }
    
    this.handleChange = this.handleChange.bind(this);  
    this.handleSubmit = this.handleSubmit.bind(this);
  }  

  handleChange(event) {
    this.setState({input: event.target.value}, () => {
      const etherAmount = this.state.input.toString()
      this.setState({output: this.state.input*100}, () => {
        //console.log(this.state.output)
      })
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    let etherAmount
    etherAmount = this.state.input
    etherAmount = window.web3.utils.toWei(etherAmount)
    this.props.buyTokens(etherAmount)
  }

  render() {
    return (
          <form className="mb-3" onSubmit= {this.handleSubmit}>
            <div>
              <label className="float-left"><b>Ether</b></label>
              <span className="float-right text-muted">
                Balance: {window.web3.utils.fromWei(this.props.ethBalance, 'ether')}
              </span>
            </div>
            <div className="input-group mb-4">
              <input
                type="text"
                value={this.state.input}
                onChange={this.handleChange}
                className="form-control form-control-lg"
                placeholder="0"
                required />
              <div className="input-group-append">
                <div className="input-group-text">
                  <img src={ethLogo} height="32" alt=""/>
                  &nbsp;&nbsp;&nbsp; ETH
                </div>
              </div>
            </div>
            <div>
              <label className="float-left"><b>Dapp</b></label>
              <span className="float-right text-muted">
                Balance: {window.web3.utils.fromWei(this.props.tokenBalance, 'ether')}
              </span>
            </div>
            <div className="input-group mb-2">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="0"
                value={this.state.output}
                disabled 
              />            
              <div className="input-group-append">
                <div className="input-group-text">
                  <img src={tokenLogo} height="32" alt=""/>
                  &nbsp; DApp
                </div>
              </div>
            </div>
            <div className="mb-5">
              <span className="float-left text-muted">Exchange Rate</span>
              <span className="float-right text-muted">1 ETH = 100 DApp</span>
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg">SWAP!</button>
          </form>
    );
  }
}

export default BuyForm;
