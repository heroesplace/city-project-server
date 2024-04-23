const { onPushMessage } = require('./features/chat')
const { onPullMailbox } = require('../socket/features/mailbox')
const { onInviteCharacter, onReplyToInvite, onInviteDelete, onPullInviteMembers } = require('../socket/features/invites')

exports.events = {
    'push_chat_message': onPushMessage,

    'push_invite_character': onInviteCharacter,
    'push_invite_delete': onInviteDelete,
    'push_invite_reply': onReplyToInvite,

    'pull_invite_members': onPullInviteMembers,
    'pull_character_mailbox': onPullMailbox,
}