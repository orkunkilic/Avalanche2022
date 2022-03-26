
import { Button, Center, Flex, Input, Box, chakra, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom';

function App({ initWalletConnection, disconnectWallet, account }){
  return (
    <Box className="navbar" w='100vw' h='70px' backgroundColor='#6e0707' p='4' color='white' shadow='0 0 10px 2px white'>
      <Flex flexDir='row' justifyContent='space-between' alignItems='stretch'>
        <Text fontSize='24' fontWeight='bold' as={Link} to='/'>ExpiryDator</Text>
        {account ? (
          <Button size='sm' colorScheme='red' onClick={disconnectWallet}>Disconnect</Button>
        ) : (
          <Button size='md' colorScheme='red'  onClick={initWalletConnection}>Connect Wallet</Button>
        )}
      </Flex>
    </Box>
  );
}

export default App;
