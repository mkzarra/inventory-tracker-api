'use strict'

// creating a base name for the mongodb
const mongooseBaseName = 'inventory-tracker'

// create the mongodb uri for development and test
const database = {
  development: `mongodb://localhost/27017${mongooseBaseName}-development`,
  test: `mongodb://localhost/27017${mongooseBaseName}-test`
}

// Identify if development environment is test or development
// select DB based on whether a test file was executed before `server.js`
const localDb = process.env.TESTENV ? database.test : database.development

// Environment variable MONGODB_URI will be available in
// heroku production evironment otherwise use test or development db
const currentDb = process.env.MONGODB_URI || localDb

module.exports = currentDb
