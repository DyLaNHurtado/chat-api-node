const mongoose = require("mongoose");
const Schema= mongoose.Schema;

const UserSchema= Schema({
    name:{
        type:String,
        require:false,
    },
    lastname:{
        type:String,
        require:false
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    status:{
        type:String,
        require:false,
        default: "Online"
    },
    avatar:{
        type:String,
        require:false
    },
},{
    versionKey:false,
    timestamps:true
});

module.exports=mongoose.model("User",UserSchema);