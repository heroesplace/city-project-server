import { onPushMessage } from './features/chat.js'
import { onPullMailbox } from '../socket/features/mailbox.js'
import { onCreateVillage } from '../socket/features/village.js'
import { onIsVillager } from '../socket/features/character.js'
import { onPullMap, onPlayerMove } from '../socket/features/map.js'

import invite from '../socket/features/invites.js'

const events = {
    'push_chat_message': onPushMessage,

    'invite_add_character': invite.charts.onAddCharacter,
    'invite_remove_character': invite.charts.onRemoveCharacter,

    'invite_cancel': invite.charts.onCancel,
    'invite_reply': invite.charts.onReply,

    'invite_pull_characters': invite.charts.onPullCharacters,
    'pull_character_mailbox': onPullMailbox,

    'village_create': onCreateVillage,
    'chracter_is_villager': onIsVillager,
    'map': onPullMap,
    "move": onPlayerMove
}

export { events }