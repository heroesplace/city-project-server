const { AccountModel } = require('./models/account.model.js')
const { CharacterModel } = require('./models/character.model.js')
const { DiscordModel } = require('./models/discord.model.js')
const { InviteModel } = require('./models/invite.model.js')
const { MessageModel } = require('./models/message.model.js')
const { VillageModel } = require('./models/village.model.js')

exports.models = {
	Account: AccountModel,
    Character: CharacterModel,  
    Discord: DiscordModel,
    Invite: InviteModel,
    Message: MessageModel,
    Village: VillageModel,
}