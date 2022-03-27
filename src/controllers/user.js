const fs = require('fs');
const path = require("path");
const User = require('../models/user');
const Chat = require('../models/chat');
const bcrypt = require('bcrypt');
const jwt = require('../services/jwt');


async function register(req,res,next){
    const user = new User();
    const {name,lastname,email,password} = req.body;
    try {
        if(!email || !password || !name || !lastname){
            throw{error:"❌ Fill all the fields to register"};
        }
            const foundEmail = await User.findOne({email});
            if(foundEmail){throw{error:"❌ The email is already in use.!"}}
            const salt = bcrypt.genSaltSync(10);
            user.email=email;
            user.password= await bcrypt.hash(password,salt);
            user.name= name;
            user.lastname=lastname;
            user.save();
            res.status(200).send(user);
    } catch (error) {
        next(error);
    }
}

async function login(req,res,next){
    const {email,password} = req.body;
    try {
        const user = await User.findOne({email});
        //Lanzo el mismo error para no dar pistas a un posible atacante
        if(!user){
            throw{error:"❌ Incorrect email or password"};
        }
        const passwordSuccess=await bcrypt.compare(password,user.password);
        if(!passwordSuccess){
            throw{error:"❌ Incorrect email or password"};
        }
        res.status(200).send({token: jwt.createToken(user,"24h")});

    } catch (error) {
        next(error);
    }
}

async function addContact(req,res,next){ 
    const idUser= req.params.id;
    const {email}= req.body;
    try{
        const user= await User.findById(idUser);
        if(!user){
            res.status(404).send({error:"❌ Cannot found the user by id"});
        }else{
            const query = User.find({"email":email});
            const newContact = await query.exec();
            console.log(newContact[0]._id );

                if(!user.contacts.includes(newContact[0]._id)){
                    user.contacts= user.contacts.concat(newContact[0]._id);
                    console.log(user.contacts)
                    await User.findByIdAndUpdate(idUser,user);
                    const chat= new Chat();
                    chat.members=[idUser,newContact[0]._id];
                    await chat.save();
                    res.status(200).send({msg:"✅ Contact added to user!"}); 
                }else{
                    res.status(400).send({error:"❌ That contact has already been added previously!"});
                }
           
        }
    }catch(error){
        next(error);
    }
}

function uploadAvatar(req,res,next){
    const params= req.params;
    User.findById({_id:params.id},(err,userData)=>{
        if(err){
            next(err);
        }else{
            if(!userData){
                res.status(404).send({error:"❌ Cannot found user!"})
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
                        res.status(400).send({error:"❌ Image extension is not allowed (Only .png or .jpg)"})
                    }else{
                        user.avatar = fileName;

                        User.findByIdAndUpdate({_id:params.id},user,(err,userResult)=>{
                            if(err){
                                res.status(500).send({error: "❌ Server error!"});
                            }else if(!userResult){
                                res.status(404).send({error:"❌ Cannot found user!"});
                            }else{
                                res.status(200).send({msg:"✅ Avatar updated!"});
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
            res.status(404).send({error:"❌ Avatar not found."});
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