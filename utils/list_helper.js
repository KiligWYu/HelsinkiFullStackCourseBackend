const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((sum, item) => sum + item.likes, 0)
}

const favoriteBlog = blogs => {
  if (blogs.length == 0) { return {} }
  const likes = Math.max(...blogs.map(blog => blog.likes))
  const favoriteBlog = blogs.find(blog => blog.likes === likes)
  return {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes
  }
}

const mostBlogs = blogs => {
  if (blogs.length == 0) { return {} }

  const t1 = _.groupBy(blogs, (blog) => blog.author)
  const t2 = _.mapValues(t1, (obj) => obj.length)
  const t3 = _.values(t2)
  const most = Math.max(...t3)
  const author = _.findKey(t2, (o) => o === most)
  return result = {
    author: author,
    blogs: most
  }
}

const mostLikes = blogs => {
  if (blogs.length == 0) { return {} }

  const t1 = _.groupBy(blogs, (blog) => blog.author)
  const t2 = _.mapValues(t1, (obj) => totalLikes(obj))
  const t3 = _.values(t2)
  const most = Math.max(...t3)
  const author = _.findKey(t2, (o) => o === most)
  return result = {
    author: author,
    likes: most
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
