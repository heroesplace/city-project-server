const mongodb = require('./database')
const character = require('./character')
const auth = require('./auth')

// Fonction pour gérer l'inscription
async function register(account_name, character_name, email_address, password) {
    return new Promise((resolve, reject) => {
        mongodb.models.Account.findOne({ account_name: account_name }).then((user) => {
            if (user === null) {
                auth.hashPassword(password).then((hashedPassword) => {
                    mongodb.models.Account.collection.insertOne({
                        account_name: account_name,
                        email_address: email_address,
                        password: hashedPassword
                    }).then((e) => {
                        character.createCharacter(character_name, e.insertedId)

                        resolve("Account created !")
                    });
                });
            } else {
                reject(new Error("Account already exists !"))
            }
        });
    });
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
                            resolve("Logged in !")
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