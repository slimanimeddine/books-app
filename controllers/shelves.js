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
    const body = request.body

    if (!user) {
        return response
            .status(401)
            .json({
                error: 'operation requires user authentication'
            })
    }            

    const anExistingShelf = await Shelf.findOne({name: body.name, user})

    if(anExistingShelf) {
        return response
            .status(409)
            .json({
                error: 'an existing shelf already has the same name'
            })    
    }

    const shelf = new Shelf({
        name: body.name,
        user
    })

    const savedShelf = await shelf.save()
    user.shelves = user.shelves.concat(savedShelf._id)
    await user.save()

    response
        .status(201)
        .json(savedShelf)
})

shelvesRouter.put('/:id', async (request, response) => {
    const body = request.body
    const user = request.user

    if (!user) {
        return response
            .status(401)
            .json({
                error: 'operation requires user authentication'
            })
    }  

    const anExistingShelf = await Shelf.findOne({name: body.name, user})

    if(anExistingShelf) {
        return response
            .status(409)
            .json({
                error: 'an existing shelf already has the same name'
            })    
    }

    const shelf = {
        name: body.name
    }

    const updatedShelf = await Shelf.findByIdAndUpdate(request.params.id, shelf, { new: true })
    
    response
        .status(200)
        .json(updatedShelf)
})

shelvesRouter.delete('/:id', async (request, response) => {
    const user = request.user

    if (!user) {
        return response
            .status(401)
            .json({
                error: 'operation requires user authentication'
            })
    }            

    await Shelf.findByIdAndRemove(request.params.id)
    
    response
        .status(204)
        .end()
})

export default shelvesRouter