const mongoose = require('mongoose')

exports.models = {
	Accounts: mongoose.model('Accounts', {
        account_name: {
            type: String,
            required: true
        },
        email_address: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        accountStatus: {
            type: Number,
            default: 0
        }, // 0 = non vérifié, 1 = vérifié, 2 = banni
        ipAddresses: [String],
        discordId: "ObjectId",
        preferences: {
            language: String,
            theme: String
        },
        twoFactorAuth: {
            enabled: {
                type: Boolean,
                default: false
            },
            secret: String
        },
        lastConnection: {
            type: Date,
            default: Date.now
        },
        currentCharacter: "ObjectId",
        lastCharacter: "ObjectId",
        admin: {
            type: Boolean,
            default: false
        },
        registrationDate: {
            type: Date,
            default: Date.now
        },
        friends: ["ObjectId"],
        characters: "ObjectId",
        blockedUsers: ["ObjectId"],
        playtime: {
            type: Number,
            default: 0
        },
        achievements: [{
            id: "ObjectId",
            progress: Number
        }]
	}),
    DiscordUsers: mongoose.model('DiscordUsers', {
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
    }, "discord_users"),
    Characters: mongoose.model('Characters', {
        character_name: String,
        owner: "ObjectId",
        creationDate: Date,
        connected: {
            type: Boolean,
            default: true
        },
        coords: {
            x: {
                type: Number,
                default: 0
            },
            y: {
                type: Number,
                default: 0
            },
            direction: {
                type: String,
                default: "bottom"
            }
        },
        job: {
            id: Number,
            xp: Number
        },
        village: "ObjectId",
        inventory: "ObjectId",
        money: Number,
        sprite: "ObjectId",
        stats: {
            hp: Number,
            /* maxHp: Number, */
        },
        quests: [{
            id: "ObjectId",
            status: Number
        }],
        statusEffects: [{
            id: "ObjectId",
            duration: Number // par exemple, en secondes
        }],
        invites: ["ObjectId"]
    }),
    Messages: mongoose.model('Messages', {
        content: String,
        author: {
            type: "ObjectId",
            required: true
        }, // Character Object Id
        date: Date,
        channel: String
    }),
    Villages: mongoose.model('Villages', {
        name: String,
        owner: "ObjectId",
        creationDate: Date,
        coords: {
            x: Number,
            y: Number
        },
        expands: [
            {
                x: Number,
                y: Number
            }
        ],
        members: ["ObjectId"], // Character Object Id
        buildings: [{
            id: Number,
            type: String,
            level: Number,
            coords: {
                x: Number,
                y: Number
            },
        }]
    }),
    Invites: mongoose.model('Invites', {
        sender: "ObjectId",
        receiver: [{
            character_id: "ObjectId",
            status: Number, // 0 = en attente, 1 = acceptée, 2 = refusée
            date: Date
        }],
    }, "invites")
}