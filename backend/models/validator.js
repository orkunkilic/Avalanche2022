const mongoose = require('mongoose')
const {nanoid} = require('nanoid')

const validatorSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => nanoid()
        },
        node_id: String,
        tx_id: String,
        uptime: String,
        start_time: Number,
        end_time: Number,
    },
    {
        collection: 'validators',
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
)

const Validator = mongoose.model('Validator', validatorSchema)

module.exports = Validator