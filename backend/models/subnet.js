const mongoose = require('mongoose')
const {nanoid} = require('nanoid')
const { Schema } = mongoose;

const subnetSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => nanoid()
        },
        subnet_id: String,
        alias: String,
        /* validators: [{
            type: String,
            ref: 'Validator'
        }], */
        subscribers: {
            mail: [{
                address: String,
                subscribed_at: {
                    type: Number,
                    default: Date.now().valueOf()
                },
            }],
            webhook: [{
                url: String,
                subscribed_at: {
                    type: Number,
                    default: Date.now().valueOf()
                },
            }]
        },
    },
    {
        collection: 'subnets',
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
)

const Subnet = mongoose.model('Subnet', subnetSchema)

module.exports = Subnet