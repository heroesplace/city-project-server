const pg = require('pg')
const { Pool } = pg
 
const pool = new Pool({
    host: process.env.DATABASE_ADDRESS || 'localhost',
    port: 5432,
    database: 'cityproject',
    user: 'cityproject',
    password: 'salut'
})
 
const query = (text, params, callback) => pool.query(text, params, callback)

const getClient = () => pool.connect()

module.exports = {
    query,
    getClient
}