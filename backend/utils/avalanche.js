
const { Avalanche } = require('avalanche')

const ip = "api.avax.network"
const port = 443
const protocol = "https"
const networkID = 5
const avalanche = new Avalanche(ip, port, protocol, networkID)

const avalancheP = avalanche.PChain()

module.exports = avalancheP