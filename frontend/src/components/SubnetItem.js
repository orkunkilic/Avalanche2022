import React, { useContext, useState } from 'react'
import { Button, Center, Flex, Input, Box, Badge, Text, chakra } from '@chakra-ui/react'
import { Link } from 'react-router-dom';
import { Web3Context } from '../hooks/web3Context';
import { useToast } from '@chakra-ui/react'

const ListItem = chakra(Box, {
    baseStyle: {
        border: '1px solid',
        borderColor: 'gray.200',
        width: '90%',
        padding: '1rem',
        marginBottom: '1rem',
        cursor: 'pointer',
        borderRadius: 'xl',
        justifyContent: 'start',
        shadow:'0 0 8px 1px white'
    },
});


export default function SubnetItem({subnet, handleModal}) {
const value = useContext(Web3Context)
const toast = useToast()

  return (
    <ListItem key={subnet.id} backgroundColor={subnet._id ? 'white' : 'gray.200'} >
            <Flex flexDir='row' alignItems='center' justifyContent='space-between'>
                <Flex flexDir='column' alignItems='flex-start' justifyContent='center' h='100%'>
                    <Flex alignItems='baseline'>
                        <Text fontWeight='bold'>
                            {subnet.alias ? subnet.alias : subnet.id}
                            {subnet.alias && <Badge ml={5} colorScheme='green'>Regıstered</Badge>}
                        </Text>
                    </Flex>
                    {subnet.subnet_id && <Text fontWeight='thin'>{subnet.subnet_id}</Text>}
                </Flex>
                <Flex>
                    {subnet.alias ? (
                        <Button size='md' colorScheme='red'  disabled={!value} onClick={() => handleModal(0, subnet)}>Subscribe</Button>
                    ) : (
                        <Button size='md' colorScheme='red' backgroundColor='#b52f2f' disabled={!value} onClick={() => handleModal(1, subnet)}>Register</Button>                    
                    )}
                    <Button ml={5} as={Link} to={subnet._id ? `subnet/${subnet._id}`:`subnet/${subnet.id}`} size='md' colorScheme='green'>Details</Button>
                </Flex>
            </Flex>
        </ListItem>
    
  )
}
