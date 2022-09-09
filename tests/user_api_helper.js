const User = require('../models/user')

const initialUsers = [
  {
    username: 'Kilig',
    name: 'wy'
  },
  {
    username: 'root',
    name: 'root'
  }
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialUsers,
  usersInDb
}
