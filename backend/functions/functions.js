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


 const getYearOldSubscribers = async () => {
    return await Subnet.find({
      "subscribers.mail.subscribed_at": {$lt: (new Date()).valueOf() - (1000 * 60/*  * 60 * 24 * 365 */ )}
  
    }, {
      subscribers: 1,
      alias: 1,
      subnet_id:1
    })
  }
  
  
  //make this util
 const checks = async (endTime, ntf) => {
    const now = Date.now()
    const period = ntf ? ntf.period : 31
    const dates = {
      1: now + (1 * 24 * 60 * 60 * 1000),
      3: now + (3 * 24 * 60 * 60 * 1000),
      5: now + (5 * 24 * 60 * 60 * 1000),
      15: now + (15 * 24 * 60 * 60 * 1000),
      30: now + (30 * 24 * 60 * 60 * 1000),
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
  
module.exports = {
    getYearOldSubscribers,
    getSubnetDetails,
    createSubnet,
    getValidatorsOfSubnet,
    getPropsOfValidators,
    addMail,
    addWebhook,
    checks
}