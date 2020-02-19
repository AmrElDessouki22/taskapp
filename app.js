const express = require('express')
const routers = require('./routers/routers')
var hbs = require('hbs')
const path = require('path');
require('./db/init/database')
const app = express()
const templatepath = path.join(__dirname,'./template/views')
app.set('view engine', 'hbs')
app.set('views',templatepath)
const pathstatic = path.join(__dirname, './public')
app.use(express.static(pathstatic))
app.use(express.json())
const port = process.env.PORT 
app.use(routers)
app.listen(port)