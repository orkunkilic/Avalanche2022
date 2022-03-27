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
    if(wal.length > 0) {
      await onboard.setChain({ chainId: '0xa869' })
      setWallet(wal[0])
    }
  }

  async function disconnectWallet() {
    const [primaryWallet] = await onboard.state.get().wallets;
    if (!primaryWallet) return;
    await onboard.disconnectWallet({ label: primaryWallet.label });
    setWallet(null)
    setWeb3(null)
    setAccount(null)
  }


  return (
    <Web3Context.Provider value={web3}>
    <Flex flexDir='column' className="App" justify='center' mt='70px' backgroundColor='#6e0707' height={'100%'} justifyContent='center'>
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
