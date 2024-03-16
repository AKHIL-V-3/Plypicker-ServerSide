const express = require('express')
const http = require('http')
const Mongoose = require("./src/Frameworks/Database/connection")
const Server = require("./src/Frameworks/Server/express")

const app = express()
const server = http.createServer(app)

const DataBase = Mongoose()
DataBase()
Server.expressConfig(app)
Server.serverConfig(server)

