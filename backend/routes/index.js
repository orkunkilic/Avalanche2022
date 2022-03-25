const express = require('express');
const router = express.Router();
const avalancheP = require('../utils/avalanche')
const mongoose = require('mongoose')
const connectDB = require('../utils/db')
const Subnet = require('../models/subnet.js')
const Validator = require('../models/validator.js')
const Tx = require('../models/tx.js')
const axios = require('axios');
const Notification = require('../models/notification');

router.get('/:id', async (req, res) => {
  const id = req.params.id
  let subnet = await Subnet.findById(id)|| await Subnet.findOne({subnet_id: id})
  if(!subnet) {
    subnet = await getSubnetDetails(id)
  } else {
    subnet = {alias: subnet.alias, ...await getSubnetDetails(subnet.subnet_id)}
  }
  res.json(subnet)
})

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const subnetsFromChain = await avalancheP.getSubnets();
    const subnetsFromDB = await Subnet.find({})
    const unRegisteredSubnets = subnetsFromChain.filter(subnet => {
      return !subnetsFromDB.find(subnetFromDB => subnetFromDB.subnet_id === subnet.subnet_id);
    })

    res.json({subnetsFromDB, unRegisteredSubnets})
  
  } catch (error) {
    res.json(error)
  }
});

router.post('/register', async (req, res, next) => {
  let { subnet_id } = req.query
  const { alias } = req.body

  if(!subnet_id) {
    return res.status(400).json({error: "Missing fields"})
  }
    const subnet = await createSubnet(subnet_id, alias) 
    res.json(subnet)
})

router.post('/subscribe', async (req, res, next) => {
  const { id } = req.query
  const { mail, webhook, tx_id } = req.body
  const txRecord = await Tx.findOne({tx_id})
  if(txRecord) {
    return res.status(400).json({error: "Tx already exists"})
  }

  if(!(mail || webhook)) {
    return res.status(400).json({error: "Missing fields"})
  }  

  const tx = await axios.get(`https://api.covalenthq.com/v1/43114/transaction_v2/${tx_id}/?key=ckey_8ad51b914d3e4cec8f6ab99d9db`)
  const event = (tx.data.data.items[0].log_events[0].decoded)
  const value = (tx.data.data.items[0].value) / 10**18

  if(true) { //if tx events are correct
    const tx = new Tx({tx_id})
    await tx.save()
  }
  //make their comparison

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
    //const validators = subnet.validators
    const validators = await getValidatorsOfSubnet(subnet.subnet_id)
    const validatorsWithProps = await getPropsOfValidators(validators)
  /*   const validatorsToBeDeleted = validators.filter(validator => {
      return !validatorsOnNetwork.find(validatorOnNetwork => validatorOnNetwork.nodeID === validator.node_id)
    })
    for(const validator of validatorsToBeDeleted) {
      await Validator.findOneAndDelete({address: validator.address})
    }
    */
    for(const validator of validatorsWithProps) {
      const ntf = await Notification.findOne({node_id: validator.node_id});
      const check = checks(validator.end_time, ntf)
      if(check.send) {
        for(address of subnet.subscribers.mail){
          sendMail(1, address, validator.node_id, left, subnet.subnet_id)
        }
        for(webhook of subnet.subscribers.webhook) {
          sendWebhook(1, url, validator.node_id, left, subnet.subnet_id)
        }
      }
      if(validator.uptime < 0.5) {
        for(address of subnet.subscribers.mail){
          sendMail(2, address, validator.node_id, left, subnet.subnet_id)
        }
        for(webhook of subnet.subscribers.webhook) {
          sendWebhook(2, url, validator.node_id, left, subnet.subnet_id)
        }
      }
    }
  }
  res.json({message: "done"})
})

//make this util
const checks = async (endTime, ntf) => {
  const now = Date.now()
  const period = ntf ? ntf.period : 31
  //reverse object keys and take it from config file
  const dates = {
    30: now - (30 * 24 * 60 * 60 * 1000),
    15: now - (15 * 24 * 60 * 60 * 1000),
    5: now - (5 * 24 * 60 * 60 * 1000),
    3: now - (3 * 24 * 60 * 60 * 1000),
    1: now - (1 * 24 * 60 * 60 * 1000),
  }
  for(const dateKey in dates.reverse()) {
    if(dates[dateKey] < endTime && period > dateKey) {
      if(ntf) {
        await Notification.findOneAndUpdate({validator: ntf.validator}, {period: dateKey})
      } else {
        const ntf = new Notification({validator: ntf.validator})
        await ntf.save()
      }
      return {send:true, left:dateKey}
    }
  }
}

const getSubnetDetails = async (subnet_id) => {
  const validatorOfSubnet = await getValidatorsOfSubnet(subnet_id)
  const validatorWithProps = await getPropsOfValidators(validatorOfSubnet)

  return {subnet_id, validators:validatorWithProps}

}
const createSubnet = async(subnet_id, alias) => {
  /* const validatorOfSubnet = await getValidatorsOfSubnet(subnet_id)
  const validatorWithProps = await getPropsOfValidators(validatorOfSubnet)
  //console.log(validatorWithProps)
  const validatorIds = await addValidators(validatorWithProps)
  console.log("valIds:>>", validatorIds) */
  const subnet = new Subnet({
    subnet_id: subnet_id,
    alias: alias,
    //validators: validatorIds,
  })
  await subnet.save()
  return subnet
}

const addValidators = async (validators) => {
  console.log("start add vals")
  const valIds = []
  for(const val of validators) {
    console.log("val:>>", val)
    let validator = await Validator.findOne({
      node_id: val.node_id
    })
    if(!validator) {
      console.log(val)
      validator = await createValidators(val)
      console.log("val added!", validator)
    }
    valIds.push(validator.id)
  }
  return valIds
}

const createValidators = async (val) => {
  let validator = new Validator(val)
  validator = await validator.save()
  console.log("val added!")
  return validator
}

const getValidatorsOfSubnet = async (subnet_id) => {
  return (await avalancheP.getCurrentValidators(subnet_id)).validators
}

//pick properties from validator array of objects
const getPropsOfValidators = (validators) => {
  return validators.map(val => {
    return {
      node_id: val.nodeID,
      tx_id: val.txID,
      start_time: val.startTime,
      end_time: val.endTime,
      uptime: val.uptime,
    }
  })
}

const addMail = async (id, mail) => {
  const updated = await Subnet.findByIdAndUpdate(id, {
    $push: {
      "subscribers.mail": {
        address: mail,
        subscribed_at: Date.now()
      }
    }
  }, {new: true})
  if(updated) return true;
}
const addWebhook = async (id, webhook_url) => {
  const updated = await Subnet.findByIdAndUpdate(id, {
    $push: {
      "subscribers.webhook": {
        url: webhook_url,
        subscribed_at: Date.now()
      }
    }
  })
  if(updated) return true;
}

module.exports = router;
