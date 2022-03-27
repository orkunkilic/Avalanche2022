import React, { useContext, useRef, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    Input
  } from '@chakra-ui/react'
import { Web3Context } from '../hooks/web3Context'
import { post } from '../hooks/api'
  
export default function RegisterModal({isOpen, onClose, subnetDetails}) {
    const [step, setStep] = useState(0)
    const [tx, setTx] = useState()
    const [name, setName] = useState()
    const value = useContext(Web3Context)
    const register = async () => {
        try {
            setStep(1)
            const res = await value.eth.sendTransaction({
                from: value.eth.accounts.currentProvider.selectedAddress,
                to: '0x3AEEb871F83C85E68fFD1868bef3425eD6649D39',
                value: value.utils.toWei('1', 'ether')
            })
            if(res.transactionHash) {
                setTx(res.transactionHash)
                const req = await post('register', {
                    subnet_id: subnetDetails.id,
                    name: name,
                    tx_id: res.transactionHash
                })
                if(req?.subnet_id) {
                    setStep(2)
                } else {
                    alert(JSON.stringify(req))
                    setStep(0)
                }
            }
        } catch (error) {
            alert(error)
            setStep(0)
        }
        
    }
  return (
    <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Register Subnet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {step === 0 && <>
                <Text>You are registering subnet: <b>{subnetDetails.id}</b></Text>
                <Text fontSize='sm' pt={5}>Please double check before registration</Text>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder='Name of the subnet (Note that this cannot be changed afterwards)' />
                <Text>Price: 1 AVAX</Text>
                <Button onClick={() => register()}>Register</Button>               
            </>}              
            {step === 1 && <>
                <Text>Subnet registration is in progress...</Text>
            </>}
            {step === 2 && <>
                <Text>Subnet registration is complete!</Text>
                <Text>Transaction hash: <b>{tx}</b></Text>
                <Text>You can close the modal.</Text>
            </>}
          </ModalBody>
        </ModalContent>
      </Modal>
  )
}
