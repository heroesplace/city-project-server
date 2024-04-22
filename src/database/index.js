const pg = require('pg')
const { Pool } = pg
 
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'salut',
    database: 'cityproject'
})
 
const query = (text, params, callback) => pool.query(text, params, callback)

const getClient = () => pool.connect()

module.exports = {
    query,
    getClient
}