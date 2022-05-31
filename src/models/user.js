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
        default: "Hi! I am a new user in Cosmos!"
    },
    avatar:{
        type:String,
        require:false,
    },
    theme:{
        type:String,
        require:false,
        default: '0'
    },
    background:{
        type:String,
        require:false,
        default: 'background-image: url(https://raw.githubusercontent.com/DyLaNHurtado/chat-angular/…e449d34f6efe09a53964e64b7b379f2aa3/src/assets/img/bg-art.svg)'
    },
    bgColor:{
        type:String,
        require:false,
        default: 'background: linear-gradient(to bottom, #f3efea,#8b8b8b);'
    },
    contacts: [{type: Schema.Types.ObjectId, ref:"User"}],
    chats:[{type: Schema.Types.ObjectId, ref:"Chat"}]
},{
    versionKey:false,
    timestamps:true
});

module.exports=mongoose.model("User",UserSchema);