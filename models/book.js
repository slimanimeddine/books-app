import mongoose from 'mongoose'
import validator from 'validator'

const { Schema, model } = mongoose

const bookSchema = new Schema({
    details: {
        title: {
            type: String,
            required: [true,
                'title field is required'
            ]
        },
        authors: [
            {
                authorName: String
            },
        ],
        publisher: String,
        isbn: String,
        format: String,
        image: String,
        genre: String,
        publishedDate: Date,
        pageNumber: Number,
        language: String,
        price: Number,
        series: String,
        vol: Number,
        quantity: Number,
        rating: Number,
        summary: String
    },
    note: {
        pageRead: Number,
        favorite: Boolean,
        dateAdded: Date,
        comments: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    shelf: {
        type: Schema.Types.ObjectId,
        ref: 'Shelf'        
    }
})

bookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Book = model('Book', bookSchema)

export default Book