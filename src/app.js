const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon');
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const app = express()

// view engine setup
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// require('./components/passport-config')(app)

app.use(express.static(path.join(__dirname, '../public')))

app.use('/', (req, res) => {
  res.send('Hello World')
})

// var index = require('./routes/index');
// app.use('/', index);

// util.getGlobbedPaths('./routes/client/**/*.js').forEach(function(file) {
//   app.use('/api', require(path.resolve(file)))
// })

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app