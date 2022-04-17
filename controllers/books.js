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
    const body = request.body
    const user = request.user
    const shelf = body.shelf ? await Shelf.findById(body.shelf) : null

    if (!user) {
        return response
            .status(401)
            .json({
                error: 'operation requires user authentication'
            })
    }            


    const anExistingBook = await Book.findOne(
        {
            details: {
                title: body.details.title
            },
            user
        }
    )

    if(anExistingBook) {
        return response
            .status(409)
            .json({
                error: 'an existing book already has the same title'
            })    
    }

    const book = new Book({
        ...body,
        user,
        shelf
    })

    const savedBook = await book.save()

    user.books = user.books.concat(savedBook._id)
    await user.save()

    if (shelf) {
        shelf.books = shelf.books.concat(savedBook._id)
        await shelf.save()    
    }
    
    response
        .status(201)
        .json(savedBook)
})

booksRouter.put('/:id', async (request, response) => {
    const requestedBook = await Book.findById(request.params.id)
    const requestedShelf = await Shelf.findById(requestedBook.shelf)
    const { user, body } = request
    const shelf = await Shelf.findById(body.shelf)

    if (!user) {
        return response
            .status(401)
            .json({
                error: 'operation requires user authentication'
            })
    }            

    if (body.shelf) {
        const shelfBelongsToUser = await Shelf.findById(body.shelf)
        if (shelfBelongsToUser && shelfBelongsToUser.user.toString() !== user._id.toString()) {
            return response
                .status(404)
                .json({
                    error: 'shelf does not exist'
                })
        }
    }


    const book = {
        ...body
    }

    const updatedBook = await Book.findByIdAndUpdate(request.params.id, book, { new: true })

    if (shelf && requestedShelf !== shelf) {
        shelf.books = shelf.books.concat(updatedBook._id)
        await shelf.save()

        requestedShelf.books = requestedShelf.books.filter(b => b.toString() !== updatedBook._id.toString())
        await requestedShelf.save()
    }

    response
        .status(200)
        .json(updatedBook)
})

booksRouter.delete('/:id', async (request, response) => {
    const user = request.user

    if (!user) {
        return response
            .status(401)
            .json({
                error: 'operation requires user authentication'
            })
    }            

    await Book.findByIdAndRemove(request.params.id)

    response
        .status(204)
        .end()
})

export default booksRouter