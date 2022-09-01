const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Phonebook = require('./models/phonebook')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
  Phonebook.find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get('/api/info', (request, response) => {
  Phonebook.find({})
    .then(persons => {
      const result = `<p>Phonebook has info for ${persons.length} people</p>
<p>${Date()}</p>`
      response.send(result)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Phonebook.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook.findByIdAndRemove(request.params.id)
    .then(person => {
      console.log(`delete person ${request.params.id} result:`, person)
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const person = new Phonebook({
    name: body.name,
    number: body.number
  })
  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  Phonebook.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
  console.error('error name:', error.name, ', message:', error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)
