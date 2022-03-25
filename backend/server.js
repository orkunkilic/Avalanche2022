const mongoose = require('mongoose')
const buildApp = require('./app.js')
const connectDB = require('./utils/db.js')

// DB connection
connectDB()

// Graceful Shutdown indicator
let acceptingConnections = true

// Express app
const app = buildApp()

// Graceful Shutdown middleware
app.use((req, res, next) => {
  if (!acceptingConnections) {
    res.status(503).send('Server is shutting down')
  } else {
    next()
  }
})

// Start listening
const server = app.listen(process.env.PORT || 3000)
console.log({
  log_level: 'info',
  origin: 'express',
  message: `Server ready at: http://localhost:${process.env.PORT || 3000}/`
})

// Graceful Shutdown signal handler
const gracefulShutdownHandler = (signal) => {
  console.log({
    log_level: 'info',
    origin: 'express',
    message: `Caught ${signal}, gracefully shutting down`
  })
  acceptingConnections = false

  setTimeout(() => {
    // stop the server from accepting new connections
    server.close(async () => {
      console.log({
        log_level: 'info',
        origin: 'express',
        message: 'All remaining requests canceled'
      })
      if (mongoose.connection.readyState === 1) {
        console.log({
          log_level: 'info',
          origin: 'express',
          message: 'Disconnecting from database'
        })
        await mongoose.disconnect()
        console.log({
          log_level: 'info',
          origin: 'express',
          message: 'Disconnected from database'
        })
      }

      // once the server is not accepting connections, exit
      process.exit()
    })
  }, 0)
}

// The SIGINT signal is sent to a process by its controlling terminal when a user wishes to interrupt the process.
process.on('SIGINT', gracefulShutdownHandler)
// The SIGTERM signal is sent to a process to request its termination.
process.on('SIGTERM', gracefulShutdownHandler)