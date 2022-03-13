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

    if (!user) {
        response
            .status(401)
            .json({
                error: 'operation requires user authentication'
            })
    }

    if (request.body.note.shelf) {
        shelf = await Shelf.findOne({
            name: request.body.note.shelf,
            user
        })
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

booksRouter.put('/:id', async (request, response) => {
    const user = request.user
    let requestedBook = await Book.findOne({_id: request.params.id})
    let requestedBooksShelf = await Shelf.findById(requestedBook.shelf)
    let shelf
    let book

    if (!user) {
        response
            .status(401)
            .json({
                error: 'operation requires user authentication'
            })
    }

    if (request.body.note.shelf) {
        shelf = await Shelf.findOne({
            name: request.body.note.shelf,
            user
        })
        if (shelf && shelf !== requestedBooksShelf) {
            book = {
                ...request.body,
                shelf
            }

            const updatedBook = await Book.findByIdAndUpdate(request.params.id, book, { new: true })
            shelf.books = shelf.books.concat(updatedBook._id)
            await shelf.save()
            console.log(requestedBook)
            console.log(requestedBooksShelf)
            console.log(requestedBooksShelf.books)
            requestedBooksShelf.books = requestedBooksShelf.books.filter(b => Number(b._id) !== Number(requestedBook._id))
            await requestedBooksShelf.save()
            response
                .status(200)
                .json(updatedBook)
        }
    }

    book = {
        ...request.body
    }

    const updatedBook = await Book.findByIdAndUpdate(request.params.id, book, { new: true})
    response
        .status(200)
        .json(updatedBook)
})

export default booksRouter