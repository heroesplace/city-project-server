import pg from 'pg'
import runMigrations from 'node-pg-migrate'
import dotenv from 'dotenv'
import {
  UniqueConstraintError,
  RequestSyntaxError,
  UndefinedTableError,
  ForeignKeyError
} from './errors.js'

dotenv.config()

const { Pool } = pg
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

pool.connect().then(() => {
  console.log('[db-postgres] Successfully connected to PostgreSQL database')
}).catch(err => {
  console.error('[db-postgres]', err)
  process.exit(-1)
})

const migrateDatabase = async () => {
  await runMigrations({
    dir: './migrations',
    databaseUrl: process.env.DATABASE_URL,
    direction: 'up',
    verbose: true,
    migrationsTable: 'migrations'
  }).catch(err => {
    console.error('[db-postgres] Error migrating database:', err)
    process.exit(-1)
  })
}

// TODO : rewrite this function to user super() argument from Error class
const getErrorType = (code) => {
  switch (code) {
    case '23505':
      return new UniqueConstraintError()
    case '42601':
      return new RequestSyntaxError()
    case '42P01':
      return new UndefinedTableError()
    case '23503':
      return new ForeignKeyError()
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
  getClient,
  migrateDatabase
}
