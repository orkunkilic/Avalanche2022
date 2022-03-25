import logo from './logo.svg';
import './App.css';
import { onboard } from './wallet';
import { useEffect, useState } from 'react';
import Web3 from 'web3'
import { Button, Center, Flex, Input, Box, chakra } from '@chakra-ui/react'

const subnets = [
  { id: 1, alias: 'orkun'},
  { id: 1, alias: 'orkun'},
  { id: 1, alias: 'orkun'},
  { id: 1, alias: 'orkun'},
]
const ListItem = chakra(Box, {
  baseStyle: {
    border: '1px solid',
    borderColor: 'gray.200',
    width: '90%',
    padding: '1rem',
    marginBottom: '1rem',
    cursor: 'pointer',
    borderRadius: 'xl',
    justifyContent: 'start'
  },
});
function App() {
  const [wallet, setWallet] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  useEffect(() => {
    async function init() {
      await initWeb3()
    }
    if(wallet) {
      init()
    }
  }, [wallet])
  
  async function search() {

  }

  async function initWalletConnection() {
    const wal = await onboard.connectWallet()
    await onboard.setChain({ chainId: '0xa869' })
    setWallet(wal[0])
  }

  async function initWeb3() {
    const web3 = new Web3(wallet.provider)
    setWeb3(web3)
    setAccount(web3.eth.accounts.currentProvider.selectedAddress)
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
    <Box className="App" m={5}>
      
      <Flex flexDir={'column'} alignItems='stretch' justifyContent='start' w='100vw' h='100vh'>
        <Center mb={5} w='75%' alignSelf='center'>
          <Input mr={5} placeholder='Please enter the name or id of subnet'/>
          <Button colorScheme='blue' onClick={search}>Search</Button>
        </Center>
        <Flex flexDir='column' alignItems='center'>
          {subnets.map(subnet => (
            <ListItem key={subnet.id}>
              {subnet.alias}
            </ListItem>
          ))}
        </Flex>
      </Flex>

    </Box>
  );
}

export default App;
