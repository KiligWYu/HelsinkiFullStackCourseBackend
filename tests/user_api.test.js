const supertest = require('supertest')
const User = require('../models/user')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose')
const helper = require('./user_api_helper')

beforeEach(async () => {
  await User.deleteMany({})

  for (const user of helper.initialUsers) {
    let userObject = new User(user)
    await userObject.save()
  }
}, 60000)

describe('create users', () => {
  test('fail with invalid username', async () => {
    const usersAtStart = await helper.usersInDb()

    const user = {
      username: 'wy',
      name: 'wy',
      password: '123456',
    }

    const result = await api.post('/api/users/').send(user).expect(400)
    expect(result.body.error).toContain('User validation failed')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtStart).toEqual(usersAtEnd)
  })

  test('fail with invalid password', async () => {
    const usersAtStart = await helper.usersInDb()

    const user = {
      username: 'KiligWYu',
      name: 'wy',
      password: '12',
    }

    const result = await api.post('/api/users/').send(user).expect(400)
    expect(result.body.error).toEqual('password is too weak')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtStart).toEqual(usersAtEnd)
  })

  test('fail with user existing', async () => {
    const user = {
      username: 'root',
      name: 'wy',
      password: '123456',
    }

    const result = await api.post('/api/users/').send(user).expect(400)
    expect(result.body.error).toEqual('username must be unique')
  })

  test('succeed with valid user', async () => {
    const usersAtStart = await helper.usersInDb()

    const user = {
      username: 'KiligWYu',
      name: 'wy',
      password: '123456',
    }

    const result = await api.post('/api/users/').send(user).expect(201)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtStart.concat(result.body)).toEqual(usersAtEnd)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
