const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    token: {
        auth: String,
        refresh: String,
        expires_in: Number
    },
    snowflake: String,
    username: String,
    discriminator: String,
    global_name: String,
    avatar: String,
    mfa_enabled: Boolean,
    banner: String,
    accent_color: Number,
    locale: String,
    premium_type: Number
})

exports.DiscordModel = mongoose.model('DiscordModel', schema)