const mongoose= require('mongoose')

const userSchma = new mongoose.Schema({
  username: {
    type: String,
    required: [ true, 'username is missing' ],
    minlength: 3
  },
  name: String,
  passwordHash: String,
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
})

userSchma.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('User', userSchma)
