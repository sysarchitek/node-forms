// server.js
'use strict';

const path = require('path')
const express = require('express')
const layout = require('express-layout')
const routes = require('./routes')
const app = express()

//valid form
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('express-flash')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const bodyParser = require('body-parser')
const validator = require('express-validator')

const middleware = [
  layout(),
  express.static(path.join(__dirname, 'public')),
  bodyParser.urlencoded(),
  validator(),
  cookieParser(),
  session({
    secret: 'super-secret-key',
    key: 'super-secret-cookie',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
  }),
  flash()
]
app.use(middleware)

app.use(bodyParser.json()); // to support JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/', routes)



app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(3500, () => {
  console.log(`App running at http://localhost:3500`)
})