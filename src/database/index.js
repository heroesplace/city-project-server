const pg = require('pg')
const { Pool } = pg

require('dotenv').config()

const pool = new Pool({
    host: process.env.DATABASE_HOST || 'localhost',
    port: 5432,
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD
})

const query = (text, params, callback) => pool.query(text, params, callback)

const getClient = () => pool.connect()

module.exports = {
    query,
    getClient
}