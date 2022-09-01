const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  }).catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'name is missing']
  },
  number: {
    type: String,
    validate: {
      validator: (value) => {
        return value.length >= 8 && /^\d{2,3}-?\d*$/.test(value)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'number is missing']
  }
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Phonebook', phonebookSchema)
