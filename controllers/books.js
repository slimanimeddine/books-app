import express from 'express'
import Book from '../models/book.js'
import Shelf from '../models/shelf.js'

const booksRouter = express.Router()

booksRouter.get('/', async (request, response) => {
    const books = await Book
        .find({})
        .populate('user')
        .populate('shelf')
    response.json(books)
})

booksRouter.get('/:id', async (request, response) => {
    const book = await Book
        .findById(request.params.id)
        .populate('user')
        .populate('shelf')
    response.json(book)
})

booksRouter.post('/', async (request, response) => {
    const user = request.user
    let book
    let shelf

    if (request.body.note.shelf) {
        shelf = await Shelf.findOne({name: request.body.note.shelf})
        if (shelf) {
            book = new Book({
                ...request.body,
                shelf,
                user
            })        
        }
    } else {
        book = new Book({
            ...request.body,
            user
        })
    }

    const savedBook = await book.save()
    user.books = user.books.concat(savedBook._id)
    await user.save()
    shelf.books = shelf.books.concat(savedBook._id)
    await shelf.save()
    
    response
        .status(201)
        .json(savedBook)
})

export default booksRouter