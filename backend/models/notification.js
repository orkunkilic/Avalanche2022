const mongoose = require('mongoose')
const {nanoid} = require('nanoid')

const notificationSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => nanoid()
        },
        node_id: {
            type: String,
        },
        period: {
            type: Number,
            enum: [30, 15, 5, 3, 1],
            default: 30
        }
    },
    {
        collection: 'notifications',
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
)

const Notification = mongoose.model('Notification', notificationSchema)

module.exports = Notification