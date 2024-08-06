import db from '../../../database/postgresql/index.js'

import { CharacterError } from '../../errors.js'

class Character {
  static async resolve(character) {
    if (character === undefined || character.length == 0) throw new CharacterError('EMPTY_CHARACTER_NAME')

    let searchBy = 'id' // Si on passe un id

    if (typeof character === 'string') {
      searchBy = 'name' // Si on passe un name
      character = character.trim().toLowerCase()
    }

    const r1 = await db.query(`SELECT id FROM characters WHERE ${searchBy} = $1`, [character])

    if (r1.rows.length === 0) throw new CharacterError('CHARACTER_NOT_FOUND')

    return r1.rows[0].id
  }

  static async isVillager(characterId) {
    const r1 = await db.query('SELECT * FROM villages_members WHERE character_id = $1', [characterId])

    return r1.rows.length !== 0
  }
}

export { Character }
