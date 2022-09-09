const Blog = require('../models/blog')
const User = require('../models/user')
const userHelper = require('./user_api_helper')

const initialBlogs = [
  {
    title: '全栈公开课',
    author: '赫尔辛基大学',
    url: 'https://fullstackopen.com/',
    likes: 10000,
  },
  {
    title: 'Kilig 的博客',
    author: 'Kilig',
    url: 'https://KiligWYu.com/',
    likes: 9999,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'willremovethissoon',
    url: 'https://KiligWYu.com/',
    likes: 0,
  })
  await blog.save()
  await blog.delete()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
}
