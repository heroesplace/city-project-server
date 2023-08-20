const path = require('path')
const express = require('express')

exports.expose = (app) => {
    app.use(express.static(path.join(__dirname, '../public')))

    app.get('/', (req, res) => {
      res.sendFile(__dirname + '../public/index.html')
    })
}
