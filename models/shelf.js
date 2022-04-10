import mongoose from 'mongoose'

const { Schema, model } = mongoose

const shelfSchema = new Schema({
    name: {
        type: String,
        required: [true,
            "name field is required"
        ]   
    },
    books: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Book'
        },
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

shelfSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Shelf = model('Shelf', shelfSchema)

export default Shelf