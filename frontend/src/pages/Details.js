import React, { useEffect, useState, useRef, useContext } from 'react'
import { Button, Center, Flex, Input, Box, Badge, Text, chakra } from '@chakra-ui/react'
import { useFetch } from '../hooks/useFetch';
import { Link, useParams } from 'react-router-dom';
import SubnetList from '../components/SubnetList';
import RegisterModal from '../components/RegisterModal';
import SubscribeModal from '../components/SubscribeModal';
import moment from 'moment'
import { Web3Context } from '../hooks/web3Context';

export default function Index() {
    const {id} = useParams()
    const {data, loading, error} = useFetch('subnet/' + id)
    const [subscribeModal, setSubscribeModal] = useState(false)
    const [registerModal, setRegisterModal] = useState(false)
    const value = useContext(Web3Context)
    console.log(data)
    const handleWidth = (start, end) => {
        let w = (moment().unix()/100 - start/100) / (end/100 - start/100) * 100;
        return [String(w).split('.')[0] + '%', String(100 - w).split('.')[0] + '%']
    }
    const handleModal = (modalType) => {
        if (modalType === 0)  {
            setRegisterModal(false)
            setSubscribeModal(true)
        } else {
            setSubscribeModal(false)
            setRegisterModal(true)
        }
        
    }
    const closeModals = () => {
        setRegisterModal(false)
        setSubscribeModal(false)
    }
    return (
        
        <>
        <Flex flexDir={'column'} alignItems='stretch' alignSelf='center' justifyContent='start' w='90vw' h='100vh'  m={5}>
            {!loading && !error && data && data.subnet_id && (
                <>
                {registerModal && <RegisterModal isOpen={registerModal} onClose={closeModals} subnetDetails={{id: data.subnet_id, ...data}}/>}
                {subscribeModal && <SubscribeModal isOpen={subscribeModal} onClose={closeModals} subnetDetails={{id: data.subnet_id, ...data}}/>}
                <Flex flexDir='row' justifyContent='space-between' backgroundColor='white' shadow='0 0 10px 2px white' color='black' p={6} rounded='2xl'>
                    <Flex flexDir='column'> 
                            {data.alias && <Text fontSize='4xl' fontWeight='bold'>{data.alias}</Text>}
                            <Text fontSize='2xl'>Subnet ID: {data.subnet_id}</Text>
                    </Flex>
                    {data.alias ? (
                        <Button size='md' colorScheme='red'  disabled={!value} onClick={() => handleModal(0, data)}>Subscribe</Button>
                    ) : (
                        <Button size='md' colorScheme='red' backgroundColor='#b52f2f' disabled={!value} onClick={() => handleModal(1, data)}>Register</Button>                    
                    )}
                </Flex>
                <Flex mt={6} alignItems='center' flexDirection='column'>
                    {data.validators && data.validators.map(validator => (
                        <Flex flexDir='column' py={1} px={3} my={3} key={validator.node_id} w='85%' backgroundColor='gray.200' shadow='0 0 3px 2px white' color='black' rounded='lg'>
                            <Flex flexDir='row' justifyContent='space-between'>
                                <Flex flexDir='column'>
                                    <Text fontSize='lg'>Node ID: {validator.node_id}</Text>
                                    <Text fontSize='md'>Tx ID: {validator.tx_id}</Text>
                                </Flex>
                                <Text fontSize='md'>Uptime: {validator.uptime ? <span style={{color: validator.uptime * 100 + '%' < 75 ? 'red' : 'green'}}><b>{String(validator.uptime * 100).slice(0,4) + '%'}</b></span> : <span>Undefined</span>}</Text>
                            </Flex>
                            <Flex justifyContent='stretch' flexDirection='column' width='100%' mt={3}>
                                <Flex justifyContent='space-between'>
                                    <Text fontSize='md'>Start Time: <b>{moment.unix(validator.start_time).utc().format('DD.MM.YYYY')}</b></Text>
                                    <Text fontSize='sm' fontWeight='bold'>~ {handleWidth(validator.start_time, validator.end_time)[0]}</Text>
                                    <Text fontSize='md'>End Time: <b>{moment.unix(validator.end_time).utc().format('DD.MM.YYYY')}</b></Text>
                                </Flex>
                                <Flex justifyContent='stretch' width='100%' mt={1}>
                                    <Box w={handleWidth(validator.start_time, validator.end_time)[0]} h='10px' bg='red.500' shadow='0 0 3px 1px red' rounded='lg' roundedRight='none' />
                                    <Box w={handleWidth(validator.start_time, validator.end_time)[1]} h='10px' bg='red.900' rounded='lg' roundedLeft='none' />
                                </Flex>
                            </Flex>
                        </Flex>
                    ))}
                </Flex>
                </>
            )}

            {loading && (
                <Flex flexDir='column' alignItems='center' justifyContent='center' w='100%' h='100%' color='white' p={6}>
                    <Text fontSize='4xl' fontWeight='bold'>Loading...</Text>
                </Flex>
            )}

            {!loading && !data?.subnet_id && (
                <Flex flexDir='column' alignItems='center' justifyContent='center' w='100%' h='100%' color='white' p={6}>
                    <Text fontSize='4xl' fontWeight='bold'>Error!</Text>
                    
                </Flex>
            )}        
            
        </Flex>
        
        </>
    )
}

