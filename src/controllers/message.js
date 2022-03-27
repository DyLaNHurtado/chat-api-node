const Message = require('../models/message');

async function getById(req,res){
    const idMessage= req.params.id;
    try{
        const message= await Message.findById(idMessage);
        if(!message){
            res.status(404).send({msg:"ERROR: Cannot found this message"});
        }else{
            res.status(200).send(message);
        }
    }catch(error){
        res.status(500).send(error);
    }
}

async function postMessage(req,res){
    const message= new Message();
    const params = req.body;
    message.text=params.text;
    try{
        const messageSaved = await message.save();

        if(!messageSaved){
            res.status(404).send({msg:"ERROR: Cannot save this message"});
        }else{
            res.status(200).send({message:messageSaved});
        }

    }catch(error){
        res.status(500).send(error);
    }
}

async function putMessage(req,res){
    const idMessage= req.params.id;
    const params= req.body;
    try{
        const message= await Message.findByIdAndUpdate(idMessage,params);
        if(!message){
            res.status(404).send({msg:"ERROR: Cannot update this message"});
        }else{
            res.status(200).send({msg:"Update successful !"});
        }
    }catch(error){
        res.status(500).send(error);
    }
}

async function getAllByChat(req,res){
    const idChat= req.params.id;
    try{
        const messages= await Message.find({chat:idChat}).sort({created_at:-1});
        if(!messages){
            res.status(404).send({msg:"ERROR: Cannot get the messages"});
        }else{
            res.status(200).send({msg:"Successful update !"});
        }
    }catch(error){
        res.status(500).send(error);
    }
}

async function deleteMessage(req,res){
    const idMessage= req.params.id;
    try{
        const message= await Message.findByIdAndDelete(idMessage);
        if(!message){
            res.status(404).send({msg:"ERROR: Cannot found this message"});
        }else{
            res.status(200).send({msg:"Successful delete !"});
        }
    }catch(error){
        res.status(500).send(error);
    }
}


module.exports={
    getAllByChat,
    getById,
    postMessage,
    putMessage,
    deleteMessage,
}