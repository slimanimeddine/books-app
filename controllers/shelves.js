import express from 'express'
import Shelf from '../models/shelf.js'

const shelvesRouter = express.Router()

shelvesRouter.get('/', async (request, response) => {
    const shelves = await Shelf
        .find({})
        .populate('user')
        .populate('books')
    response.json(shelves)
})

shelvesRouter.get('/:id', async (request, response) => {
    const shelf = await Shelf
        .findById(request.params.id)
        .populate('user')
        .populate('books')
    response.json(shelf)
})

shelvesRouter.post('/', async (request, response) => {
    const user = request.user
    const shelf = new Shelf({
        ...request.body,
        user
    })

    const savedShelf = await shelf.save()
    user.shelves = user.shelves.concat(savedShelf._id)
    await user.save()

    response
        .status(201)
        .json(savedShelf)
})

export default shelvesRouter