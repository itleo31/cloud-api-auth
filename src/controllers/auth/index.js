const path = require('path')
const mongoose = require('mongoose')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('config')
const _ = require('lodash')
const validator = require('validator')

const User = require('../../models/user')
const errorHandler = require('./../core/error')

exports.register = (req, res) => {
  const user = new User(req.body)
  user.provider = 'local'

  if (_.isEmpty(user.email) || _.isEmpty(user.password)) {
    return res.status(400).send({
      code: errorHandler.errorCodes.REQUEST_DATA_MISSING,
      message: 'Email and password are required',
    })
  }

  user.save(err => {
    if (err) {
      res.status(422).send({
        code: errorHandler.errorCodes.AUTH_EMAIL_EXIST,
        message: errorHandler.getErrorMessage(err),
      })
    } else {
      res.status(201).send({
        result: 'success',
      })
    }
  })
}

exports.login = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  if (_.isEmpty(email) || _.isEmpty(password)) {
    return res.status(400).send({
      code: errorHandler.errorCodes.REQUEST_DATA_MISSING,
      message: 'Email and password are required',
    })
  }

  User.findOne(
    {
      email: email.toLowerCase(),
    },
    (err, user) => {
      if (err) {
        return next(err)
      }
      if (!user || !user.authenticate(password)) {
        return res.status(401).json({
          code: errorHandler.errorCodes.AUTH_CREDENTIAL_INVALID,
          message: 'Email or password is invalid',
        })
      }

      const payload = { userId: user._id }
      const token = jwt.sign(payload, config.get('jwt.secret'))
      return res.json({
        token_type: 'Bearer',
        access_token: token,
        expires_in: -1,
      })
    },
  )
}

exports.forgotPassword = (req, res, next) => {
  const email = req.body.email

  if (_.isEmpty(email) || !validator.isEmail(email, { require_tld: false })) {
    return res.status(400).send({
      code: errorHandler.errorCodes.REQUEST_DATA_MISSING,
      message: 'Email is invalid',
    })
  }

  // TODO: implement logic here
  res.sendStatus(200)
}

exports.verifyToken = (req, res, next) => {
  res.sendStatus(200)
}
