const mongoose = require('mongoose')
const {nanoid} = require('nanoid')

const txSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => nanoid()
        },
        tx_id: {
            type: String,
            required:true
        }
    },
    {
        collection: 'txs',
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
)

const Tx = mongoose.model('Tx', txSchema)

module.exports = Tx