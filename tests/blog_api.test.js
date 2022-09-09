const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // for (let blog of helper.initialBlogs) {
  //   let blogObject = new Blog(blog)
  //   await blogObject.save()
  // }
}, 60000)

describe('when there is initially some blogs saved', () => {
  test('all blogs are returned', async () => {
    const blogs = await helper.blogsInDb()
    const blogsByApi = await api.get('/api/blogs')
    expect(blogs).toEqual(blogsByApi.body)
  })

  test('a specific blog is within the returned blogs', async () => {
    const blogs = await helper.blogsInDb()
    const titles = blogs.map((b) => b.title)
    expect(titles).toContain('全栈公开课')
  })
})

test('blog identifier is renamed to id', async () => {
  const blogs = await helper.blogsInDb()
  const ids = blogs.map((blog) => blog.id)
  expect(ids).toBeDefined()
})

describe('addition of a new blog', () => {
  test('token is required', async () => {
    const blog = {
      title: "Kilig's blog",
      author: 'Kilig',
      url: 'https://KiligWYu.com/',
      likes: 1,
    }
    await api.post('/api/blogs/').send(blog).expect(401)
  })

  test('create new blog', async () => {
    const user = {
      username: 'Kilig',
      name: 'wy',
      password: '123456',
    }
    await api.post('/api/users/').send(user)
    const loggedInUser = await api.post('/api/login/').send({
      username: user.username,
      password: user.password,
    })
    const token = `Bearer ${loggedInUser.body.token}`

    const blog = {
      title: "Kilig's blog",
      author: 'Kilig',
      url: 'https://KiligWYu.com/',
      likes: 1,
    }
    const blogsAtStart = await helper.blogsInDb()
    await api.post('/api/blogs/').set({ Authorization: token }).send(blog).expect(201)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
    expect(blogsAtEnd.map((blog) => blog.title)).toContain(blog.title)
  })

  test('title and url is required', async () => {
    const blog = new Blog({ author: 'Kilig' })
    await api.post('/api/blogs').send(blog).expect(400)
  })
})

describe('default value', () => {
  test('default value of likes is zero', async () => {
    const blog = {
      title: 'default likes is zero',
      author: 'Kilig',
      url: 'https://KiligWYu.com/',
    }
    await api.post('/api/blogs').send(blog).expect(201)
    const blogs = await helper.blogsInDb()
    const blogInDb = blogs.find((b) => b.title === blog.title)
    expect(blogInDb.likes).toBe(0)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
  })
})

describe('update a blog', () => {
  test('succeeds with status code 200 if blog is updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogBeforeUpdate = blogsAtStart[1]

    const newBlog = {
      title: 'Kilig 的博客',
      author: 'wy',
      url: 'https://KiligWYu.com/',
      likes: 10000,
    }

    await api.put(`/api/blogs/${blogBeforeUpdate.id}`).send(newBlog).expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const blogAfterUpdated = blogsAtEnd.find((blog) => blog.id === blogBeforeUpdate.id)
    expect(blogAfterUpdated.likes).toBe(newBlog.likes)
    expect(blogAfterUpdated.author).toBe(newBlog.author)
  })

  test('falis with status code 400 if blog nonexist', async () => {
    const newBlog = {
      title: 'Kilig 的博客',
      author: 'wy',
      url: 'https://KiligWYu.com/',
      likes: 10000,
    }

    await api.put('/api/blogs/123456').send(newBlog).expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
