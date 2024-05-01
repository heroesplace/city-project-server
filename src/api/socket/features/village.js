const db = require('../../../database')
const { isVillager } = require('./character')

const { UniqueConstraintError } = require('../../../database/errors')
const { CharacterError, VillageError } = require('../errors')

const onCreateVillage = async (event) => {
    const { socket, content } = event

    try {
        await createVillage(content.name, socket.character_id)
    } catch (error) {
        error.display(socket)
    }
}

const createVillage = async (name, founder) => {
    name = name.toLowerCase()

    try {
        await isVillager(founder).then((result) => {
            if (result) throw new CharacterError('IS_VILLAGE_MEMBER')
        })
    
        await db.query('INSERT INTO villages (name, founder_id) VALUES ($1, $2)', [name, founder])

        console.log(`[socket] Village ${name} créé par ${founder}`)
    } catch (e) {
        if (e instanceof UniqueConstraintError) throw new VillageError('VILLAGE_NAME_TAKEN')
        throw e
    }
}

module.exports = {
    onCreateVillage,
    createVillage
}