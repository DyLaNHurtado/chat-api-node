const mongoose = require("mongoose");
const Schema= mongoose.Schema;

const MessageSchema= Schema({
    text:{
        type:String,
        require:true
    },
},{
    versionKey:false,
    timestamps:true
});

module.exports=mongoose.model("Message",MessageSchema);