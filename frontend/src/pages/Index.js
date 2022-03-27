import React, { useEffect, useState, useRef } from 'react'
import { Button, Center, Flex, Input, Box, Badge, Text, chakra } from '@chakra-ui/react'
import { useFetch } from '../hooks/useFetch';
import { Link } from 'react-router-dom';
import SubnetList from '../components/SubnetList';
import RegisterModal from '../components/RegisterModal';
import SubscribeModal from '../components/SubscribeModal';

export default function Index() {
    const {data: fetchData, loading, error} = useFetch('')
    const [data, setData] = useState(fetchData)
    const [subscribeModal, setSubscribeModal] = useState(false)
    const [registerModal, setRegisterModal] = useState(false)
    const [subnetDetails, setSubnetDetails] = useState(null)
    const search = useRef()

    useEffect(() => {
        setData(fetchData)
    }, [fetchData])

    const searchSubnet = () => {
        if(search.current.value) {
        let filtered = data.filter(subnet => subnet.id?.toLowerCase().includes(search.current.value.toLowerCase())|| subnet.alias?.toLowerCase().includes(search.current.value.toLowerCase()))
        setData(filtered)
        } else {
            setData(fetchData)
        }
    }
    const handleModal = (modalType, subnetDetails) => {
        setSubnetDetails(subnetDetails)
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
        setSubnetDetails(null)
    }
    return (
        <>
        <Flex flexDir={'column'} alignItems='stretch' alignSelf='center' justifyContent='start' w='90vw' h='100%' backgroundColor='#6e0707' m={5}>
            <Center mb={5} w='75%' alignSelf='center'>
            <Input ref={search} mr={5} placeholder='Please enter the name or id of subnet' textColor='white' shadow='0 0 3px 0 white'/>
            <Button onClick={searchSubnet} colorScheme='red'>Search</Button>
            </Center>
            <SubnetList data={data} loading={loading} error={error} handleModal={handleModal} />
        </Flex>
        {registerModal && <RegisterModal isOpen={registerModal} onClose={closeModals} subnetDetails={subnetDetails}/>}
        {subscribeModal && <SubscribeModal isOpen={subscribeModal} onClose={closeModals} subnetDetails={subnetDetails}/>}
        </>
    )
}
