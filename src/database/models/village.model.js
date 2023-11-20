const mongoose = require('mongoose')

const schema = new mongoose.Schema({
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
})

exports.VillageModel = mongoose.model('Village', schema)