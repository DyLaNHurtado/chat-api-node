const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatSchema = Schema({
    members: [{type: Schema.Types.ObjectId, ref:"User"}],
    messages:[{type: Schema.Types.ObjectId, ref:"Message"}],
});

module.exports = mongoose.model("Chat",chatSchema);