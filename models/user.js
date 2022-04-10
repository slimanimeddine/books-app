import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'

const { Schema, model } = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 
            'name field is required'
        ],
        validate: [
            v => /^[a-z ,.'-]+$/i.test(v),
            'invalid name entered'
        ]
    },
    username: {
        type: String,
        unique: [true, 
            'username entered already used'
        ],
        required: [true,
            'username field is required'
        ]
    },
    passwordHash: {
        type: String,
        required: [true,
            'password field is required'
        ]
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

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.passwordHash 
        delete returnedObject.__v
    }
})

const User = model('User', userSchema)

export default User