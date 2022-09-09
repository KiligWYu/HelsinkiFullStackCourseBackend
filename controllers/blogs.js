const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const token = request.token

  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({
      error: 'token invalid',
    })
  }

  const blog = new Blog({
    ...request.body,
    likes: request.body.likes || 0,
    user: user._id,
  })
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id)
  if (!blog) {
    return response.status(204).end()
  }
  if (blog.user.toString() === request.user._id.toString()) {
    await blog.delete()
    response.status(204).end()
  } else {
    response.status(401).json({
      error: 'token error',
    })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = { ...request.body, likes: request.body.likes || 0 }
  const result = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    context: 'query',
  })
  response.json(result)
})

module.exports = blogsRouter
