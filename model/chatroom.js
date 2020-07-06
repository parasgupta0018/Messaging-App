const mongoose = require("mongoose");

let model2 = new mongoose.Schema({

    members: [String],
    messages: [
        {
            from:String,
            body:String,
            message_status:{type: Boolean, default: false},
            created_at: { type: Date, default: Date.now },
        }
    ]
 })

module.exports = mongoose.model("chatroom", model2);