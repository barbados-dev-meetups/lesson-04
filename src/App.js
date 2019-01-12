import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Web3 from 'web3'

// Import contract
import TutorialToken from "./contracts/TutorialToken.json";

class App extends Component {

  //Initializing state
  constructor(props) {
    super(props)

    this.state = {
      account: null,
      receiver_address: '',
      web3: null,
      errorMsg: '',
      transferForm: {
        amount: 0,
        address: ''
      },
    }
  }

  //Before mounting elements on the DOM
  componentDidMount = async () => {

    setInterval(async () => {

      try {
        //Does the browser provide access to web3? (this is provided via Metamask in my case)
        if (typeof window.web3 !== undefined) {
          //Access Metamask wallet and information
          const web3 = new Web3(Web3.givenProvider)
          // const web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/v3/1813c393d9fe4b768b7e89a194fac27c"))

          // const accounts = await web3.eth.getAccounts() //account[0] is default

          // this.getBalance(web3)

          this.setState({ web3 })

        } else {
          // console.log('web3 not detected')
          this.setState({ errorMsg: 'web3 not detected' })
        }
      } catch (error) {
        this.setState({ errorMsg: 'Could not detect web3' })
      }

    }, 1000)


  }

  getBalance = async (web3) => {

    //Get logged in MetaMask ETH address
    // const accounts = await web3.eth.getAccounts()
    //Instantiate the polyToken smart contract
    //***TODO: Grab deployed contract address from commandline */
    const tutorialInstance = new web3.eth.Contract(TutorialToken.abi, '0xbdb19d309c11f67003afa4f18d6662f3048fe394')
    //Get account's POLY balance
    const ttBalance = await tutorialInstance.methods.balanceOf(this.state.receiver_address).call()
    // console.log(ttBalance)
    // tutorialInstance.methods.decimals().call({ from: accounts[0] }).then((result) => {
    //   console.log(result);
    // });
    const decimals = await tutorialInstance.methods.decimals().call()
    // console.log(decimals)
    this.setState({ balance: web3.utils.fromWei(ttBalance, "ether"), decimals })

    // console.log(tutorialInstance)
    //We use web3.utils.fromWei to display the units of the balance from wei to ether
    // this.setState({ loading: false, web3: web3, decimals: decimals, balance: web3.utils.fromWei(ttBalance, "ether"), contractInstance: tutorialInstance })

  }

  handleChange = (ev) => {
    ev.preventDefault();

    // console.log(ev.t)

    const { name, value } = ev.target

    this.setState({ [name]: value })

  }

  //Mounting elements on the DOM
  render() {

    const { balance, decimals, receiver_address, web3 } = this.state
    //const balance = this.state.balance

    return (
      <div className="App">
        <header className="App-header">
          <input type='text' name='receiver_address' value={receiver_address} onChange={(ev) => this.handleChange(ev)} />
          <button type='submit' onClick={() => { this.getBalance(web3) }}>Check balance</button>
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <p>
            Balance: {balance} TUT
            <br />
            Decimals: {decimals}
          </p>

        </header>
      </div>
    );
  }
}

export default App;
