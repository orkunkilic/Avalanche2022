
const nodemailer = require('nodemailer')
const axios = require('axios')

const sendMail = async (type, address, id, left, subnetId) => {
    const mailer = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: '',
        pass: ''
      }
    })
    const mailOptions = {
      from: '',
      to: address,
      subject: '',
      text: ''
    }
    switch(type) {
      case 1:
        mailOptions.subject = 'Your validator is about to expire'
        mailOptions.text = `Your validator ${id} of subnet ${subnetId} is about to expire in ${left} days.
         Please add new validators in order to make sure network is running.`
        break;
      case 2:
        mailOptions.subject = 'Your validator`s uptime is too low'
        mailOptions.text = `Your validator ${id} of subnet ${subnetId} uptime is very low.
         Make sure your network is still running and add new validators if it is needed.`
        break;
      case 3:
        mailOptions.subject = 'Your subscription is expired'
        mailOptions.text = `Your subscription of subnet ${subnetId} is expired.`
        break;
    }
    mailer.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err)
      } else {
        console.log(info)
      }
    }
    )
  }
const sendWebhook = async (type, address, id, left, subnetId) => {
    const body ={}
    switch(type) {
      case 1:
        body.type=1
        body.id=id
        body.left=left
        body.subnetId=subnetId
        break;
      case 2:
        body.type=2
        body.id=id
        body.subnetId=subnetId
  
        break;
      case 3:
        body.type=3
        body.subnetId=subnetId
  
        break;
    }
    axios.post(address, body)
      .then(function (response) {
        console.log(response);
      }
    )
    .catch(function (error) {
      console.log(error);
    }
    )
  
  }

module.exports = {
    sendMail,
    sendWebhook
}