const { onPushMessage } = require('./features/chat')
const { onPullMailbox } = require('../socket/features/mailbox')
const { onVillageExists, onCreateVillage } = require('../socket/features/village')

const invite = require('../socket/features/invites')

exports.events = {
    'push_chat_message': onPushMessage,

    'invite_add_character': invite.charts.onAddCharacter,
    'invite_remove_character': invite.charts.onRemoveCharacter,

    'invite_cancel': invite.charts.onCancel,
    'invite_reply': invite.charts.onReply,

    'invite_pull_characters': invite.charts.onPullCharacters,
    'pull_character_mailbox': onPullMailbox,
    'village_exists': onVillageExists,

    'village_create': onCreateVillage
}