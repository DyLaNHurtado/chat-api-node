const Chat = require('../models/chat');

async function getAll(req,res){
    try{     
        const chats= await Chat.find();
        if(!chats){
            res.status(404).send({msg:"ERROR: Cannot get the chats"});
        }else{
            res.status(200).send(chats);
        }
    }catch(error){
        res.status(500).send(error);
    }
}

async function getById(req,res){
    const idChat= req.params.id;
    try{
        const chat= await Chat.findById(idChat);
        if(!chat){
            res.status(404).send({msg:"ERROR: Cannot get this chat"});
        }else{
            res.status(200).send(chat);
        }
    }catch(error){
        res.status(500).send(error);
    }
}

async function deleteChat(req,res){
    const idChat= req.params.id;
    try{
        const chat= await Chat.findByIdAndDelete(idChat);
        if(!chat){
            res.status(404).send({msg:"ERROR: Cannot delete this chat"});
        }else{
            res.status(200).send({msg:"Successful delete !"});
        }
    }catch(error){
        res.status(500).send(error);
    }
}

async function putChat(req,res){
    const idChat= req.params.id;
    const params= req.body;
    try{
        const chat= await Chat.findByIdAndUpdate(idChat,params);
        if(!chat){
            res.status(404).send({msg:"ERROR: Cannot found this chat"});
        }else{
            res.status(200).send({msg:"Successful update!"});
        }
    }catch(error){
        res.status(500).send(error);
    }
}

module.exports={
    getAll,
    getById,
    putChat,
    deleteChat,
}