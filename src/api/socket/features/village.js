const db = require('../../../database')
const { VillageError, UniqueConstraintError } = require('../../../errors')

const onVillageExists = (event) => {
    const { io, socket, content } = event

    socket.emit('village_exists', { exists: false })
}

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
        await db.query('INSERT INTO villages (name, founder_id) VALUES ($1, $2)', [name, founder])

        console.log(`[socket] Village ${name} créé par ${founder}`)
    } catch (e) {
        if (e instanceof UniqueConstraintError) throw new VillageError('VILLAGE_NAME_TAKEN')
    }
}

module.exports = {
    onVillageExists,

    onCreateVillage,
    createVillage
}