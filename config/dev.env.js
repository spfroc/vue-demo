'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST: '"http://47.104.217.169:8083"',
  APP_HOST: '"http://47.104.217.169:8084"'

  // Mock: true,
})
