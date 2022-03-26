'use strict'
module.exports.handler = async function (event, context) {
  fetch('https://expirydator.herokuapp.com/dailyCheck', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic eW91cmxvZ2luOnlvdXJwYXNzd29yZA=='
    },
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
    }
    )
    .catch(err => {
        console.log(err)
    }
    )

};