const express = require('express')
const http = require('http')


const app = express()
const server = http.createServer(app)


server.listen(8000,()=>{
       console.log('server started at port 8000');
})
