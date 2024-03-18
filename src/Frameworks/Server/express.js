const authRouter = require("../../Routes")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const logger = require('morgan')
const express = require("express")
require("dotenv").config()

function expressConfig(app) {

      app.use(cors({
            origin: process.env.CLIENT_URL,
            credentials: true,
      }));
      app.use(cookieParser());
      app.use(express.static('public'));
      app.use(logger('dev'));
      app.use(bodyParser.json({ limit: '100mb' }));
      app.use('/auth', authRouter);

      // Error handling middleware should be placed at the end
      app.use((err, req, res, next) => {
            // Handle the error here
            res.status(500).json({ error: 'Something went wrong' });
      });
}
function serverConfig(server) {
      server.listen(process.env.PORT, () => {
            console.log(`Server started on ${process.env.PORT}`);
      })
}
const Express = {
      expressConfig,
      serverConfig
}

module.exports = Express
