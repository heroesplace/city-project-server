const mongodb = require('./database/')
const mongoose = require('mongoose')

const { ErrorCode } = require('./api/web/features/errors')

async function createCharacter(name, owner) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const character = await mongodb.models.Characters.collection.insertOne({ character_name: name, owner: owner }, { session: session });
        await mongodb.models.Accounts.updateOne({ _id: owner }, { currentCharacter: character.insertedId  }, { session: session });

        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

function getCharacterId(character_name) {
    return new Promise((resolve, reject) => {
        mongodb.models.Characters.findOne({ character_name: character_name }).then((character) => {
            if (!character) {
                reject(new ErrorCode(404, "CHARACTER_NOT_FOUND", "Character not found"))
            } else {
                resolve(character._id)
            }
        })
    })
}

module.exports = {
    createCharacter,
    getCharacterId
}