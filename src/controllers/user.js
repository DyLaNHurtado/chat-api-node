const fs = require('fs');
const path = require("path");
const User = require('../models/user');
const Chat = require('../models/chat');
const bcrypt = require('bcrypt');
const jwt = require('../services/jwt');


async function register(req,res){
    const user = new User();
    const {name,lastname,email,password} = req.body;
    try {
        if(!email || !password || !name || !lastname){
            throw{msg:"Rellene los campos para registrarse"};
        }
            const foundEmail = await User.findOne({email});
            if(foundEmail){throw{msg:"El email ya esta en uso."}}
            const salt = bcrypt.genSaltSync(10);
            user.email=email;
            user.password= await bcrypt.hash(password,salt);
            user.name= name;
            user.lastname=lastname;
            user.save();
            res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
}

async function login(req,res){
    const {email,password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            throw{msg:"Error en el email o password"};
        }
        const passwordSuccess=await bcrypt.compare(password,user.password);
        if(!passwordSuccess){
            throw{msg:"Error en el email o password"};
        }
        res.status(200).send({token: jwt.createToken(user,"12h")});

    } catch (error) {
        res.status(500).send(error);
    }
}

async function addContact(req,res){ 
    const idUser= req.params.id;
    const {email}= req.body;
    try{
        const user= await User.findById(idUser);
        if(!user){
            res.status(404).send({msg:"No se ha podido enlazar el contacto al usuario"});
        }else{
            const query = User.find({"email":email});
            const newContact = await query.exec();
            console.log(newContact[0]._id );
            if(newContact !==[]){
                if(!user.contacts.includes(newContact[0]._id)){
                    user.contacts= user.contacts.concat(newContact[0]._id);
                    console.log(user.contacts)
                    //await User.findByIdAndUpdate(idUser,user);
                    const chat= new Chat();
                    chat.members=[idUser,newContact[0]._id];
                    await chat.save();
                    res.status(200).send({msg:"Contacto enlazado al usuario!"}); 
                }else{
                    res.status(400).send({msg:"Ese contacto ya ha sido enlazado previamente"});
                }
                
            }else{
                res.status(404).send({msg:"No se ha encontrado el usuario indicado"});
            }
           
        }
    }catch(error){
        res.status(500).send(error);
    }
}

function uploadAvatar(req,res){
    const params= req.params;
    User.findById({_id:params.id},(err,userData)=>{
        if(err){
            res.status(500).send({msg:"Error del servidor"});
        }else{
            if(!userData){
                res.status(404).send({msg:"No se ha encontrado usuario"})
            }else{
                let user = userData;
                console.log(req.files)
                if(req.files){
                    const filePath=req.files.avatar.path;
                    let fileSplit=filePath.split(path.delimiter)
                    if(fileSplit.length==1){//Porque no me pilla la doble barra invertida
                        fileSplit=filePath.split("\\");
                    }
                    let fileName = fileSplit[1];
                    let extSplit = fileName.split(".");
                    let fileExt= extSplit[1];
                    if(fileExt!== "png" && fileExt!=="jpg"){
                        res.status(400).send({msg:"La extension de la imagen no esta permitida (Only .png or .jpg)"})
                    }else{
                        user.avatar = fileName;

                        User.findByIdAndUpdate({_id:params.id},user,(err,userResult)=>{
                            if(err){
                                res.status(500).send({msg: "Error servidor"});
                            }else if(!userResult){
                                res.status(404).send({msg:"No se ha encontrado el usuario"});
                            }else{
                                res.status(200).send({msg:"Avatar actualizado"});
                            }
                        });
                    }
                }
            }
        }
    });
}

function getAvatar(req,res){
    const {avatarName} = req.params;
    const filePath=`./uploads/${avatarName}`;
    fs.stat(filePath,(err,stat)=>{
        if(err){
            res.status(404).send({msg:"El avatar no existe."});
        }else{
            res.sendFile(path.resolve(filePath));
        }
    });


}
module.exports = {
    register,
    login,
    addContact,
    uploadAvatar,
    getAvatar,
}