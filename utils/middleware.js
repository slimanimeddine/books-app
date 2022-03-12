import { info, _error } from './logger.js'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const requestLogger = (request, response, next) => {
  info('Method', request.method)
  info('Path', request.path)
  info('Body', request.body)
  info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
  _error(error.message)

  if (error.name === 'CastError') {
    response
        .status(400)
        .send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    response
        .status(400)
        .json({error: error.message})
  } else if (error.name === 'JsonWebTokenError') {
    response
        .status(401)
        .json({
          error: 'invalid token',
        })
  } else if (error.name === 'TokenExpiredError') {
    response
        .status(401)
        .json({
          error: 'token expired',
        })
  }

  next(error)
}

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const decodedToken = jwt.verify(authorization.substring(7), process.env.SECRET)
    if (decodedToken) {
      request.user = await User.findById(decodedToken.id)
    }
  }

  next()
}

export { requestLogger, unknownEndpoint, errorHandler, userExtractor }