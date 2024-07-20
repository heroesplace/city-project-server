import auth from './auth.js'
import db from './database/postgresql/index.js'
import { UniqueConstraintError } from './database/postgresql/errors.js'

// Fonction pour gérer l'inscription
async function register (accountName, characterName, emailAddress, password) {
  if (!accountName || !characterName || !emailAddress || !password) throw new Error('Missing fields !')

  accountName = accountName.toLowerCase()
  characterName = characterName.toLowerCase()
  emailAddress = emailAddress.toLowerCase()

  const client = await db.getClient()

  try {
    await client.query('BEGIN')

    const hashedPassword = await auth.hashPassword(password)

    const res = await db.queryTransaction(client, 'INSERT INTO accounts (name, email_address, password) VALUES ($1, $2, $3) RETURNING id', [accountName, emailAddress, hashedPassword])

    await db.queryTransaction(client, 'INSERT INTO characters (name, account_id) VALUES ($1, $2) RETURNING id', [characterName, res.rows[0].id])

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

async function login (accountName, password) {
  accountName = accountName.toLowerCase()

  const r1 = await db.query('SELECT id, password FROM accounts WHERE name = $1', [accountName])

  if (r1.rows.length === 0) throw new Error('ACCOUNT_NOT_FOUND')

  const account = r1.rows[0]

  const passwordMatches = await auth.comparePasswords(password, account.password)

  if (!passwordMatches) throw new Error('WRONG_PASSWORD')

  const r2 = await db.query('SELECT characters.name name FROM characters JOIN accounts ON account_id = accounts.id WHERE accounts.name = $1', [accountName])

  const characters = r2.rows[0]

  return auth.generateToken({
    accountId: account.id,
    characterName: characters.name
  })
}

export default {
  register,
  login
}
