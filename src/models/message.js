const mongoose = require("mongoose");
const Schema= mongoose.Schema;

const MessageSchema= Schema({
    text:{
        type:String,
        require:true
    },
    time:{
        type:String,
        require:false,
    },
    author:{type: Schema.Types.ObjectId, ref:"User"},
    chat:{type: Schema.Types.ObjectId, ref:"Chat"},
},{
    versionKey:false,
    timestamps:true
});

module.exports=mongoose.model("Message",MessageSchema);