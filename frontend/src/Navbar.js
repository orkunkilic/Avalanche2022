
import { Button, Center, Flex, Input, Box, chakra, Text } from '@chakra-ui/react'

function App({ initWalletConnection, disconnectWallet, account }){
  return (
    <Box className="navbar" w='100vw' h='60px' backgroundColor='blue.800' p='4'>
      <Flex flexDir='row' justifyContent='space-between' alignItems='stretch'>
        <Text fontSize='18'>ValidatorNotifier</Text>
        {account ? (
          <Button size='sm' onClick={disconnectWallet}>Disconnect</Button>
        ) : (
          <Button size='sm' onClick={initWalletConnection}>Connect Wallet</Button>
        )}
      </Flex>
    </Box>
  );
}

export default App;
