const mongoose = require('mongoose')
const { hashPassword } = require('../../auth')

const schema = new mongoose.Schema({
    account_name: {
        type: String,
        required: true,
        set: (value) => value.toLowerCase()
    },
    email_address: {
        type: String,
        required: true,
        set: (value) => value.toLowerCase()
    },
    password: {
        type: String,
        required: true
    },
    verificationStatus: {
        type: Number,
        default: 0
    }, // 0 = non vérifié, 1 = vérifié, 2 = banni
    ipAddresses: [String],
    discordId: "ObjectId",
    preferences: {
        language: { type: String },
        theme: { type: String }
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
    creationDate: {
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
})

// Middleware pre-save pour hacher le mot de passe
schema.pre('save', async function(next) {
    // Si le mot de passe n'est pas modifié, passez au prochain middleware
    if (!this.isModified('password')) return next()

    try {
        this.password = await hashPassword(this.password)
        next()
    } catch (error) {
        next(error)
    }
})

exports.AccountModel = mongoose.model('Account', schema)