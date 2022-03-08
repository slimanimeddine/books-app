import express from 'express'
import mongoose from 'mongoose'
import 'express-async-errors'
import cors from 'cors'
import config from './utils/config.js'
import logger from './utils/logger.js'
import { requestLogger, unknownEndpoint, errorHandler } from './utils/middleware.js'

const app = express()

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

export default app