const authRouter = require("../../Routes/authRouter")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const logger = require('morgan')
require("dotenv").config()

function expressConfig(app) {

      app.use(bodyParser.json())
      app.use(cookieParser())
      app.use(cors({
            origin: 'http://localhost:5173',
            credentials: true,
      }))
      app.use(logger("dev"))
      app.use(
            bodyParser.urlencoded({
                  limit: "50mb",
                  extended: true,
                  parameterLimit: 50000,
            })
      );
      app.use('/auth', authRouter)
}
function serverConfig(server) {
      server.listen(process.env.PORT, () => {
            console.log(`Server started on ${process.env.PORT}`);
      })
}
const express = {
      expressConfig,
      serverConfig
}

module.exports = express
