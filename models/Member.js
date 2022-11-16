const mongoose = require('mongoose')

const Member = new mongoose.Schema({
    firstName: {type: String, require:true}, 
    lastName: {type: String, require:true}, 
    discordID: {type: Number,unique:true},
    bananaCount: Number,
    checkInTime: Date|| null,
    checkOutTime: Date || null,
    shameCount: Number, 
})

module.exports = mongoose.model('Members',Member)