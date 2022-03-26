import { onboard } from './wallet';
import { useEffect, useState, useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Index from './pages/Index';
import Web3 from 'web3'
import Navbar from './Navbar'
import { Button, Center, Flex, Input, Box, Badge, chakra } from '@chakra-ui/react'
import { Web3Context } from './hooks/web3Context';
import Details from './pages/Details';

function App() {
  const [wallet, setWallet] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
 
  useEffect(() => {
    async function init() {
      const web3Instance = new Web3(wallet.provider)
      setAccount(web3Instance.eth.accounts.currentProvider.selectedAddress)
      setWeb3(web3Instance)
    }
    if(wallet) {
      init()
    }
  }, [wallet])


  async function initWalletConnection() {
    const wal = await onboard.connectWallet()
    await onboard.setChain({ chainId: '0xa869' })
    setWallet(wal[0])
  }

  async function disconnectWallet() {
    const [primaryWallet] = await onboard.state.get().wallets;
    if (!primaryWallet) return;
    await onboard.disconnectWallet({ label: primaryWallet.label });
    setWallet(null)
    setWeb3(null)
    setAccount(null)
  }

  async function sendTransaction() {
    console.log(web3)
    console.log(account)
    const tx = await web3.eth.sendTransaction({
      from: account,
      to: '0x206eEe77456933161403a4d04d39eFF994aBAa0b',
      value: web3.utils.toWei('0.1', 'ether')
    })
    console.log(tx)
  }

  return (
    <Web3Context.Provider value={web3}>
    <Flex flexDir='column' className="App" backgroundColor='#6e0707' justifyContent='center'>
    <Navbar initWalletConnection={initWalletConnection} disconnectWallet={disconnectWallet} account={account}/>
    <Routes>
      <Route path="/" element= {
        <Index />
      } />
      <Route path="/subnet/:id" element= {
        <Details />
      } />
    </Routes>   
    </Flex>
    </Web3Context.Provider>

  );
}

export default App;
