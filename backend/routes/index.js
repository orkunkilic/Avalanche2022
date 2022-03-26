const express = require('express');
const router = express.Router();
const avalancheP = require('../utils/avalanche')
const mongoose = require('mongoose')
const connectDB = require('../utils/db')
const Subnet = require('../models/subnet.js')
const Tx = require('../models/tx.js')
const axios = require('axios');
const Notification = require('../models/notification');
const { sendMail, sendWebhook } = require('../functions/send');
const { getYearOldSubscribers, checks, getSubnetDetails, createSubnet, getValidatorsOfSubnet, getPropsOfValidators, addMail, addWebhook } = require('../functions/functions')

router.get('/subnet/:id', async (req, res) => {
  const id = req.params.id
  try {
    let subnet = await Subnet.findById(id)|| await Subnet.findOne({subnet_id: id})
    if(!subnet) {
      subnet = await getSubnetDetails(id)
    } else {
      subnet = {alias: subnet.alias, _id: subnet._id, ...await getSubnetDetails(subnet.subnet_id)}
    }
    return res.json(subnet)
  } catch (error) {
    res.json(error)
  }

})

router.get('/', async (req, res, next) => {
  try {
    const subnetsFromChain = await avalancheP.getSubnets();
    const subnetsFromDB = await Subnet.find({}, {subnet_id:1, alias:1})
    const unRegisteredSubnets = subnetsFromChain.filter(subnet => {
      return !subnetsFromDB.find(subnetFromDB => subnetFromDB.subnet_id === subnet.id);
    })

    res.json([...subnetsFromDB, ...unRegisteredSubnets])
  
  } catch (error) {
    res.json(error)
  }
});

router.post('/register', async (req, res, next) => {
  const { subnet_id, name, tx_id } = req.body
  const txRecord = await Tx.findOne({tx_id})
  if(txRecord) {
    return res.status(400).json({error: "Tx already exists"})
  }

  if(!subnet_id) {
    return res.status(400).json({error: "Missing fields"})
  }
  const tx = await axios.get(`https://api.covalenthq.com/v1/43113/transaction_v2/${tx_id}/?key=ckey_8ad51b914d3e4cec8f6ab99d9db`)
  const value = (tx.data.data.items[0].value) / 10**18
  if(value < 0.1) {
    return res.status(400).json({error: "Value is too low"})
  }
  
  const txDB = new Tx({tx_id})
  await txDB.save()

  const subnet = await createSubnet(subnet_id, name) 
  res.json(subnet)
})

router.post('/subscribe', async (req, res, next) => {
  const { id, mail, webhook, tx_id } = req.body
  const txRecord = await Tx.findOne({tx_id})
  if(txRecord) {
    return res.status(400).json({error: "Tx already exists"})
  }

  if(!(mail || webhook)) {
    return res.status(400).json({error: "Missing fields"})
  }  

  const tx = await axios.get(`https://api.covalenthq.com/v1/43113/transaction_v2/${tx_id}/?key=ckey_8ad51b914d3e4cec8f6ab99d9db`)
  const value = (tx.data.data.items[0].value) / 10**18
  if(mail && webhook) {
    if(value < 0.02) {
      return res.status(400).json({error: "Value is too low"})
    }
  } else {
    if(value < 0.01) {
      return res.status(400).json({error: "Value is too low"})
    }
  }
  const txDB = new Tx({tx_id})
  await txDB.save()


  let updated;
  if(mail) {
    updated = await addMail(id, mail)
  } 
  if(webhook) {
    updated = await addWebhook(id, webhook)
  }
  res.json(updated)

})

//move this into job
router.get('/dailyCheck', async (req, res, next) => {
  if (  req.headers.authorization !== 'Basic eW91cmxvZ2luOnlvdXJwYXNzd29yZA==') // we do not need complicated auth system for one route    
    return res.status(401).send('Authentication required.') // Access denied.

  const subnets = await Subnet.find({}).populate('validators')
  for(const subnet of subnets) {
    const validators = await getValidatorsOfSubnet(subnet.subnet_id)
    const validatorsWithProps = await getPropsOfValidators(validators)
    for(const validator of validatorsWithProps) {
      const ntf = await Notification.findOne({node_id: validator.node_id});
      const check = checks(validator.end_time, ntf)
      if(check.send) {
        for(address of subnet.subscribers.mail){
          sendMail(1, address, validator.node_id, left, subnet.subnet_id)
        }
        for(webhook of subnet.subscribers.webhook) {
          if(address)
          sendWebhook(1, url, validator.node_id, left, subnet.subnet_id)
        }
      }
      if(validator.uptime < 0.5) {
        for(address of subnet.subscribers.mail){
          sendMail(2, address, validator.node_id, null, subnet.subnet_id)
        }
        for(webhook of subnet.subscribers.webhook) {
          sendWebhook(2, url, validator.node_id, null, subnet.subnet_id)
        }
      }
    }
  }
  const yearOldSubscribers = await getYearOldSubscribers();
  if(yearOldSubscribers.length > 0) {
    for(const subnet of yearOldSubscribers){
      for(const mail of subnet.subscribers.mail) {
        sendMail(3, mail.address, null, null, subnet.subnet_id)
        await Subnet.updateOne({_id: subnet._id}, {subscribers: {$pull: {mail: {_id: mail._id}}}})
      }
      for(const webhook of subnet.subscribers.webhook) {
        sendWebhook(3, webhook.url, null, null, subnet.subnet_id)
        await Subnet.updateOne({_id: subnet._id}, {subscribers: {$pull: {webhook: {_id: webhook._id}}}})
      }
    }
  }


  res.json({message: "done"})
})



module.exports = router;
