import pg from 'pg'
import dotenv from 'dotenv'

import {
  UniqueConstraintError,
  RequestSyntaxError,
  UndefinedTableError
} from './errors.js'

dotenv.config()

const { Pool } = pg
const pool = new Pool()

pool.connect().then(() => {
  console.log('[database] Successfully connected to PostgreSQL database')
}).catch(err => {
  console.error('[database]', err)
  process.exit(-1)
})

// TODO : rewrite this function to user super() argument from Error class
const getErrorType = (code) => {
  switch (code) {
    case '23505':
      return new UniqueConstraintError()
    case '42601':
      return new RequestSyntaxError()
    case '42P01':
      return new UndefinedTableError()
    default:
      return new Error(code)
  }
}

const query = async (text, params, callback) => {
  return await pool.query(text, params, callback).catch(e => {
    throw getErrorType(e.code)
  })
}

const queryTransaction = async (client, text, params, callback) => {
  return await client.query(text, params, callback).catch(e => {
    throw getErrorType(e.code)
  })
}

const getClient = () => pool.connect()

export default {
  query,
  queryTransaction,
  getClient
}
