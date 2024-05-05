import db from '../../../database/postgresql/index.js'
import { isVillager } from './character.js'

import { UniqueConstraintError } from '../../../database/postgresql/errors.js'
import { CharacterError, VillageError } from '../errors.js'

const onCreateVillage = async ({ socket, content }) => {
  try {
    await createVillage(content.name, socket.characterId)
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

export {
  onCreateVillage,
  createVillage
}
