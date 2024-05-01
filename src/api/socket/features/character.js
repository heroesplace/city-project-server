const db = require('../../../database')

const onIsVillager = (event) => {
    const { socket } = event

    isVillager(socket.character_id).then((result) => {
        socket.emit('chracter_is_villager', { is_villager: result })
    })
}

const isVillager = async (character_id) => {
    const r1 = await db.query('SELECT * FROM village_members WHERE character_id = $1', [character_id])

    return (r1.rows.length !== 0)
}

module.exports = {
    onIsVillager,
    isVillager
}