const express = require('express');

const app = express()

const http = require('http').Server(app)

app.use('/', express.static(__dirname + '/www'))


http.listen(3000)