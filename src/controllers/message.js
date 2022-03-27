const Message = require('../models/message');

async function getById(req,res,next){
    const idMessage= req.params.id;
    try{
        const message= await Message.findById(idMessage);
        if(!message){
            res.status(404).send({error:"❌ Cannot found this message"});
        }else{
            res.status(200).send(message);
        }
    }catch(error){
        next(error);
    }
}

async function postMessage(req,res,next){
    const message= new Message();
    const params = req.body;
    message.text=params.text;
    try{
        const messageSaved = await message.save();

        if(!messageSaved){
            res.status(404).send({error:"❌ Cannot save this message"});
        }else{
            res.status(200).send({message:messageSaved});
        }

    }catch(error){
        next(error);
    }
}

async function putMessage(req,res,next){
    const idMessage= req.params.id;
    const params= req.body;
    try{
        const message= await Message.findByIdAndUpdate(idMessage,params);
        if(!message){
            res.status(404).send({error:"❌ Cannot update this message"});
        }else{
            res.status(200).send({msg:"✅ Update successful !"});
        }
    }catch(error){
        next(error);
    }
}

async function getAllByChat(req,next){
    const idChat= req.params.id;
    try{
        const messages= await Message.find({chat:idChat}).sort({created_at:-1});
        if(!messages){
            res.status(404).send({error:"❌ Cannot get the messages"});
        }else{
            res.status(200).send(messages);
        }
    }catch(error){
        next(error);
    }
}

async function deleteMessage(req,res,next){
    const idMessage= req.params.id;
    try{
        const message= await Message.findByIdAndDelete(idMessage);
        if(!message){
            res.status(404).send({error:"❌ Cannot found this message"});
        }else{
            res.status(200).send({msg:"✅ Successful delete !"});
        }
    }catch(error){
        next(error);
    }
}


module.exports={
    getAllByChat,
    getById,
    postMessage,
    putMessage,
    deleteMessage,
}