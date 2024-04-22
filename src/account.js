const auth = require('./auth')
const db = require('./database')

// Fonction pour gérer l'inscription
async function register(account_name, character_name, email_address, password) {
  const client = await db.getClient()

  try {
    await client.query('BEGIN')

    const res = await client.query('INSERT INTO accounts (name, email_address, password) VALUES ($1, $2, $3) RETURNING id ', [account_name, email_address, password])
                await client.query('INSERT INTO characters (name, account_id) VALUES ($1, $2) RETURNING id', [character_name, res.rows[0].id])

    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw new Error('An error has occured !')
  } finally {
    client.release()
  }
}
async function login (account_name, password) {
  const request = await db.query(`SELECT id, name, password FROM accounts WHERE name = $1`, [account_name])

  if (request.rows.length === 0) throw new Error("Account not found.")

  const account = request.rows[0]

  const passwordMatches = await auth.comparePasswords(password, account.password)

  if (passwordMatches) {
    return auth.generateToken({
      account_id: account.id,
      account_name: account.name
    })
  } else {
    throw new Error('Wrong password !')
  }
}

module.exports = {
  register,
  login
}
