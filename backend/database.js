const mongoose = require('mongoose')

exports.models = {
	Account: mongoose.model('Account', {
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
        discordId: String,
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
    DiscordUser: mongoose.model('DiscordUser', {
        auth_token: String,
        snowflake: String,
        username: String,
        discriminator: String,
        global_name: String,
        avatar: String,
        bot: Boolean,
        mfa_enabled: Boolean,
        banner: String,
        accent_color: Number,
        locale: String,
        verified: Boolean,
        email: String,
        flags: Number
    }),
    Character: mongoose.model('Character', {
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
        }]
    })
}

exports.connect = (uri) => {
    console.log("[mongodb] Tentative de connexion à la base de données..")

    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(
        () => {
            console.log("[mongodb] Connexion à la base de données réussie !")
        },
        err => {
            console.log("[mongodb] Echec de la connexion à la base de données !")

            process.exit(1)
        }
    )
}