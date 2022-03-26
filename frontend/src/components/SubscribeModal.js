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
    Input,
    Stack

  } from '@chakra-ui/react'
import { Web3Context } from '../hooks/web3Context'
import { post } from '../hooks/api'
import { Checkbox, CheckboxGroup } from '@chakra-ui/react'

export default function SubscribeModal({isOpen, onClose, subnetDetails}) {
    const [step, setStep] = useState(0)
    const [tx, setTx] = useState()
    const [mail, setMail] = useState()    
    const [webhook, setWebhook] = useState()    
    const [isMail, setIsMail] = useState(false)
    const [isWebhook, setIsWebhook] = useState(false)

    const value = useContext(Web3Context)
    const register = async () => {
        try {
            setStep(1)
            const res = await value.eth.sendTransaction({
                from: value.eth.accounts.currentProvider.selectedAddress,
                to: '0x206eEe77456933161403a4d04d39eFF994aBAa0b',
                value: value.utils.toWei(isMail && isWebhook ? '0.02' : '0.01', 'ether')
            })
            if(res.transactionHash) {
                setTx(res.transactionHash)
                const req = await post('subscribe', {
                    id: subnetDetails._id,
                    mail: isMail ? mail : null,
                    webhook: isWebhook ? webhook : null,
                    tx_id: res.transactionHash
                })
                if(req) {
                    setStep(2)
                } else {
                    alert('An error occured!')
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
          <ModalHeader>Subscribe to Subnet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {step === 0 && <>
                <Text>You are subscribing to a subnet: <b>{subnetDetails.alias}</b></Text>
                <Stack spacing={[1, 5]} direction={['column', 'row']}>
                    <Checkbox value='mail' onChange={e => setIsMail(e.target.checked)}>Mail</Checkbox>
                    <Checkbox value='webhook' onChange={e => setIsWebhook(e.target.checked)}>Webhook</Checkbox>
                </Stack>

                {isMail && (
                    <Input my={3} value={mail} onChange={e => setMail(e.target.value)} placeholder='Mail adress to get notified (Note that this cannot be changed afterwards)' />
                )}
                {isWebhook && (
                    <Input my={3} value={webhook} onChange={e => setWebhook(e.target.value)} placeholder='Webhook URL to get pushed (Note that this cannot be changed afterwards)' />
                )}
                <Text>Price: 1 AVAX / Year (per option)</Text>
                <Button onClick={() => register()} disabled={!(isMail || isWebhook)}>Subscribe</Button>               
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
