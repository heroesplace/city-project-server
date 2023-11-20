const mongodb = require('./database')
const character = require('./character')
const auth = require('./auth')

// Fonction pour gérer l'inscription
async function register(account_name, character_name, email_address, password) {
    const account = await mongodb.models.Account.findOne({ account_name: account_name })
    
    if (account) throw new Error("Account already exists !")

    const new_account = await new mongodb.models.Account({
        account_name: account_name,
        email_address: email_address,
        password: password
    }).save()

    await character.createCharacter(character_name, new_account._id)

    return "Account created !"
}

// Fonction pour gérer la connexion
async function login(account_name, password) {
    return new Promise((resolve, reject) => {
        mongodb.models.Account.findOne({ account_name: account_name }).then((account) => {
            if (account === null) {
                reject(new Error("Account not found !"))
            } else {
                auth.comparePasswords(password, account.password).then((passwordMatches) => {
                    if (passwordMatches) {
                        mongodb.models.Account.updateOne({ _id: account._id }, { lastConnection: Date.now() }).then(() => {
                            mongodb.models.Character.findOne({ owner: account._id }).then((character) => {
                                resolve(auth.generateToken({ account_id: account._id, account_name: account.account_name, character_id: character._id, character_name: character.character_name }))
                            })
                        })
                    } else {
                        reject(new Error("Wrong password !"))
                    }
                })
            }
        })
    })
}

module.exports = {
    register,
    login
}