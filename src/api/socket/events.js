import { onPullMailbox } from './features/mailbox.js'
import { onCreateVillage, onIsVillager } from './features/village.js'
import { onCharacterSpawn, onCharacterMove } from './features/character.js'
import { onJoinChannel, onPushChatMessage } from './features/chat/channels.js'

import invite from './features/invites.js'

const events = {
  invite_add_character: invite.charts.onAddCharacter,
  invite_remove_character: invite.charts.onRemoveCharacter,

  invite_cancel: invite.charts.onCancel,
  invite_reply: invite.charts.onReply,

  invite_pull_characters: invite.charts.onPullCharacters,
  pull_character_mailbox: onPullMailbox,

  village_create: onCreateVillage,

  character_is_villager: onIsVillager,
  character_spawn: onCharacterSpawn,
  character_move: onCharacterMove,

  join_chat_channel: onJoinChannel,
  push_chat_message: onPushChatMessage
}

export { events }
