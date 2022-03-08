import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
const { Schema, model } = mongoose

const shelfSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true   
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

shelfSchema.plugin(mongooseUniqueValidator)

const Shelf = model('Shelf', shelfSchema)

export default Shelf