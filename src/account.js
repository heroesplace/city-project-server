import auth from './auth.js'
import db from './database/index.js'
import { UniqueConstraintError } from './database/errors.js'

// Fonction pour gérer l'inscription
async function register(account_name, character_name, email_address, password) {
  if (!account_name || !character_name || !email_address || !password) throw new Error('Missing fields !')

  account_name = account_name.toLowerCase()
  character_name = character_name.toLowerCase()
  email_address = email_address.toLowerCase()

  const client = await db.getClient()

  try {
    await client.query('BEGIN')

    const hashedPassword = await auth.hashPassword(password)

    const res = await db.queryTransaction(client, 'INSERT INTO accounts (name, email_address, password) VALUES ($1, $2, $3) RETURNING id ', [account_name, email_address, hashedPassword])
                await db.queryTransaction(client, 'INSERT INTO characters (name, account_id) VALUES ($1, $2) RETURNING id', [character_name, res.rows[0].id])

    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    if (e instanceof UniqueConstraintError) {
      console.log(e)
      // throw new Error('ACCOUNT_ALREADY_EXISTS')
    }
  } finally {
    client.release()
  }
}

async function login(account_name, password) {
  account_name = account_name.toLowerCase()

  const r1 = await db.query(`SELECT id, password FROM accounts WHERE name = $1`, [account_name])

  if (r1.rows.length === 0) throw new Error('ACCOUNT_NOT_FOUND')

  const account = r1.rows[0]

  const passwordMatches = await auth.comparePasswords(password, account.password)

  if (!passwordMatches) throw new Error('WRONG_PASSWORD')

  const r2 = await db.query('SELECT characters.name name FROM characters JOIN accounts ON account_id = accounts.id WHERE accounts.name = $1', [account_name])

  const characters = r2.rows[0]

  return auth.generateToken({
    account_id: account.id,
    character_name: characters.name 
  })
}

export default {
  register,
  login
}
