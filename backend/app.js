const express = require('express')
const cors = require('cors')
const indexRouter = require('./routes/index.js')

const buildApp = () => {
  const app = express()

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
  }))

  app.use('/', indexRouter)

  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json(err)
  })

  return app
}

module.exports = buildApp