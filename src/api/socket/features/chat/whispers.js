import db from '../../../../database/postgresql/index.js'
import { joinChannel } from './channels.js'

const findWhisperChannelId = async (characterId1, characterId2) => {
  const res = await db.query('SELECT * FROM channels_whisper WHERE (character_1 = $1 AND character_2 = $2) OR (character_1 = $2 AND character_2 = $1)', [characterId1, characterId2])

  if (res.rows.length === 0) return

  return res.rows[0].channel_id
}

const joinWhisperChannel = async (io, characterId1, characterId2) => {
  const channelId = await findWhisperChannelId(characterId1, characterId2)

  console.log("e", channelId)

  await joinChannel(io.to(characterId1), channelId)
  await joinChannel(io.to(characterId2), channelId)
}

export {
  joinWhisperChannel,
  findWhisperChannelId
}