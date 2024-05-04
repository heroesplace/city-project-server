import db from '../../../database/index.js'

const onIsVillager = async ({ socket }) => {
    const result = await isVillager(socket.character_id)
    socket.emit('character_is_villager', { is_villager: result })
}

const isVillager = async (character_id) => {
    const r1 = await db.query('SELECT * FROM village_members WHERE character_id = $1', [character_id])
    
    return (r1.rows.length !== 0)
}

export { onIsVillager, isVillager }