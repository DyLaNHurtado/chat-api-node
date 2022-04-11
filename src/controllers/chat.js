const Chat = require('../models/chat');
const User = require('../models/user');
const Message = require('../models/message');

async function getAll(req,res,next){
    try{     
        const chats= await Chat.find({})
        .populate({path:"messages",model:'Message'})
        .populate({path:"members",model:'User'})
        .exec();
        
        res.status(200).send(chats);
    }catch(error){
        next(error);
    }
}

async function getById(req,res,next){
    const idChat= req.params.id;
    try{
        const chat= await Chat.findById(idChat)
        .populate({path:"messages",model:'Message'})
        .populate({path:"members",model:'User'}).exec();
        if(!chat){
            res.status(404).send({error:"❌ Cannot get this chat"});
        }else{
            res.status(200).send(chat);
        }
    }catch(error){
        next(error);
    }
}

async function deleteChat(req,res,next){
    const idChat= req.params.id;
    try{
        const chat= await Chat.findByIdAndDelete(idChat);
        if(!chat){
            res.status(404).send({error:"❌ Cannot delete this chat"});
        }else{
            res.status(200).send({msg:"✅ Successful delete !"});
        }
    }catch(error){
        next(error);
    }
}

async function putChat(req,res,next){
    const idChat= req.params.id;
    const params= req.body;
    try{
        const chat= await Chat.findByIdAndUpdate(idChat,params);
        if(!chat){
            res.status(404).send({error:"❌ Cannot found this chat"});
        }else{
            res.status(200).send({msg:"✅ Successful update!"});
        }
    }catch(error){
        next(error);
    }
}

module.exports={
    getAll,
    getById,
    putChat,
    deleteChat,
}