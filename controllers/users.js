import express from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user.js'

const usersRouter = express.Router()

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({})
        .populate('books')
        .populate('shelves')
    
    response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
    const user = await User
        .findById(request.params.id)
        .populate('books')
        .populate('shelves')

    response.json(user)
})

usersRouter.post('/', async (request, response) => {
    const { name, username, password } = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        name,
        username,
        passwordHash
    })

    const savedUser = await user.save()

    response
        .status(201)
        .json(savedUser)
})

usersRouter.put('/:id', async (request, response) => {
    const updatedUser = await User.findByIdAndUpdate(request.params.id, request.body, { new: true })

    response
        .status(200)
        .json(updatedUser)
})

export default usersRouter