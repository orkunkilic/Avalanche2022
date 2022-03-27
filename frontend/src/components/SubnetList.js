import React, { useEffect } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import SubnetItem from './SubnetItem';


export default function SubnetList({data, loading, error, handleModal}) {
  return (
    <Flex flexDir='column' alignItems='center' w='auto' height='80vh' overflowY='scroll' py={3} px={0}>
    {loading && (
        <Flex flexDir='column' alignItems='center' w='100%' h='100%' color='white' justifyContent='center'>
            <Text fontSize='xl' fontWeight='bold'>Loading...</Text>
        </Flex>
    )}
    {!loading && !error && data && data.map(subnet => (
        <SubnetItem subnet={subnet} key={subnet.id} handleModal={handleModal}/>
    ))}
    {!loading && error && (
        <Flex flexDir='column' alignItems='center' w='100%' h='100%' color='white' justifyContent='center'>
            <Text fontSize='xl' fontWeight='bold'>Error!</Text>
         </Flex>   
    )}
</Flex>
  )
}
