const pg = require('pg')
const { Pool } = pg
const { UniqueConstraintError, RequestSyntaxError } = require('./errors')

require('dotenv').config()

const pool = new Pool()

pool.connect()
.then(() => {
  console.log('[database] Connecté à la base de données');
})
.catch(err => {
  console.error('[database]', err)
  process.exit(-1)
})

const getErrorType = (code) => {
  switch (code) {
      case '23505':
          return new UniqueConstraintError()
      case '42601':
          return new RequestSyntaxError()
      default:
          return new Error("Unknown error")
  }
}

const query = async (text, params, callback) => {
  return await pool.query(text, params, callback).catch(e => {
    throw getErrorType(e.code)
  })
}

const getClient = () => pool.connect()

module.exports = {
    query,
    getClient
}