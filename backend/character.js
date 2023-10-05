const mongodb = require('./database/')
const mongoose = require('mongoose')

async function createCharacter(name, owner) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const character = await mongodb.models.Character.collection.insertOne({ character_name: name, owner: owner }, { session: session });
        await mongodb.models.Account.updateOne({ _id: owner }, { currentCharacter: character.insertedId  }, { session: session });

        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

module.exports = {
    createCharacter
}