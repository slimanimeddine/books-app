import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'

const { Schema, model} = mongoose

const shelfSchema = new Schema({
    name: {
        type: String,
        unique: [true,
            "shelf's name must be unique"
        ],
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

shelfSchema.plugin(mongooseUniqueValidator)

const Shelf = model('Shelf', shelfSchema)

export default Shelf