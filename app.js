const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
require('dotenv').config()
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

logger.info('connenting to MongoDB...')

const MONGODB_URI =
  process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logger.success('Connected to MongoDB database.')
  })
  .catch((error) => {
    logger.error('error to connenting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())

const blogsRouter = require('./controllers/blogs')
app.use('/api/blogs', middleware.userExtractor, blogsRouter)

const usersRouter = require('./controllers/users')
app.use('/api/users', usersRouter)

const loginRouter = require('./controllers/login')
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
