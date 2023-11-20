const mongodb = require('./database/')
const mongoose = require('mongoose')

const { ErrorCode } = require('./api/web/features/errors')

async function createCharacter(name, owner) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const character = await new mongodb.models.Character({
            character_name: name,
            owner: owner
        }, { session: session }).save()

        await mongodb.models.Account.updateOne({ _id: owner }, { currentCharacter: character.insertedId  }, { session: session })

        await session.commitTransaction()
        session.endSession()
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

async function getCharacterIdFromName(character_name) {
    const character = await mongodb.models.Character.findOne({ character_name: character_name })
    
    if (!character) {
        throw new ErrorCode(404, "CHARACTER_NOT_FOUND", "Character not found")
    } else {
        return character._id
    }
}

async function getCharacterNameFromId(character_id) {
    const character = await mongodb.models.Character.findOne({ _id: character_id })
    
    if (!character) {
        throw new ErrorCode(404, "CHARACTER_NOT_FOUND", "Character not found")
    } else {
        return character.character_name
    }
}

module.exports = {
    createCharacter,
    getCharacterIdFromName,
    getCharacterNameFromId
}