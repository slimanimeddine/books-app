import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
const { Schema, model } = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: true        
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true                
    },
    books: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Book'
        },
    ],
    shelves: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Shelf'
        }
    ]
})

userSchema.plugin(mongooseUniqueValidator)

const User = model('User', userSchema)

export default User