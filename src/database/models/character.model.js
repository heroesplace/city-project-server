const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    character_name: {
        type: String,
        required: true
    },
    owner: {
        type: "ObjectId",
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
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
})

exports.CharacterModel = mongoose.model('Character', schema)