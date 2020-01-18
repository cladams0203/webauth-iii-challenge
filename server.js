const express = require('express')

const userRouter = require('./users/usersRouter')

const server = express()

server.use(express.json())
server.use('/api/users', userRouter)

module.exports = server