import mongoose from 'mongoose'
import validator from 'validator'
const { Schema, model } = mongoose

const bookSchema = new Schema({
    details: {
        title: {
            type: String,
            required: true
        },
        authors: [
            {
                authorLastName: String,
                authorFirstName: String        
            },
        ],
        publisher: String,
        isbn: {
            type: String,
            validate: validator.isISBN(13)
        },
        format: String,
        image: Buffer,
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

const Book = model('Book', bookSchema)

export default Book