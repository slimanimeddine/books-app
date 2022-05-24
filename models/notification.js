import mongoose from 'mongoose'

const { Schema, model } = mongoose

const notificationSchema = new Schema({
    content: String,
    dateSent: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

notificationSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Notification = model('Notification', notificationSchema)

export default Notification