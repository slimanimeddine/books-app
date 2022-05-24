import express from 'express'
import mongoose from 'mongoose'
import 'express-async-errors'
import cors from 'cors'
import usersRouter from './controllers/users.js'
import loginRouter from './controllers/login.js'
import booksRouter from './controllers/books.js'
import shelvesRouter from './controllers/shelves.js'
import notificationsRouter from './controllers/notifications.js'
import { MONGODB_URI } from './utils/config.js'
import { requestLogger, unknownEndpoint, errorHandler, userExtractor } from './utils/middleware.js'

const app = express()
await mongoose.connect(MONGODB_URI)

app.use(cors())
app.use(express.static('build'))
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb'}))
app.use(requestLogger)
app.use(userExtractor)

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/books', booksRouter)
app.use('/api/shelves', shelvesRouter)
app.use('/api/notifications', notificationsRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

export default app