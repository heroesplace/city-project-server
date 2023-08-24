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

                        resolve()
                    });
                });
            } else {
                reject()
            }
        });
    });
}

// Fonction pour gérer la connexion
async function login(account_name, password) {
    return new Promise((resolve, reject) => {
        mongodb.models.Account.findOne({ account_name: account_name }).then((account) => {
            if (account === null) {
                reject()
            } else {
                auth.comparePasswords(password, account.password).then((passwordMatches) => {
                    if (passwordMatches) {
                        resolve(auth.generateToken({ 
                            account_name: account.account_name,
                            currentCharacter: account.currentCharacter 
                        }))
                    } else {
                        reject()
                    }
                });
            }
        });
    });
}

module.exports = {
    register,
    login
}