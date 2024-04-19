const mongodb = require('./database')
const character = require('./character')
const auth = require('./auth')

// Fonction pour gérer l'inscription
async function register (account_name, character_name, email_address, password) {
  const account = await mongodb.models.Account.findOne({ account_name })

  if (account) throw new Error('Account already exists !')

  const new_account = await new mongodb.models.Account({
    account_name,
    email_address,
    password
  }).save()

  await character.createCharacter(character_name, new_account._id)

  return 'Account created !'
}

async function login (account_name, password) {
  const account = await mongodb.models.Account.findOne({ account_name })

  if (!account) throw new Error('Account not found !')

  const passwordMatches = await auth.comparePasswords(password, account.password)

  if (passwordMatches) {
    await mongodb.models.Account.updateOne({ _id: account._id }, { lastConnection: Date.now() })

    const character = await mongodb.models.Character.findOne({ owner: account._id })

    return auth.generateToken({
      account_id: account._id,
      account_name: account.account_name,
      character_id: character._id,
      character_name: character.character_name
    })
  } else {
    throw new Error('Wrong password !')
  }
}

module.exports = {
  register,
  login
}
