const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error('error name:', error.name, ', message:', error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'SyntaxError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token',
    })
  } else if (error.name === 'TokenExpiredError') {
    response.status(401).json({
      error: 'token expired',
    })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }

  next()
}

const userExtractor = async (request, response, next) => {
  const authorization = request.get('Authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    request.user = user
  }

  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
