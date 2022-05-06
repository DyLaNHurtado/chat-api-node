    const fs = require('fs');
const path = require("path");
const Chat = require('../models/chat');
const User = require('../models/user');
const Message = require('../models/message');
const bcrypt = require('bcrypt');
const jwt = require('../services/jwt');


async function register(req,res,next){
    const user = new User();
    const {name,lastname,email,password,avatar} = req.body;
    try {
        if(!email || !password || !name || !lastname){
            res.status(400).send({error:"❌ Fill all the fields to register"});
        }
            const foundEmail = await User.findOne({email});
            if(foundEmail){throw{error:"❌ The email is already in use.!"}}
            const salt = bcrypt.genSaltSync(10);
            user.email=email;
            user.password= await bcrypt.hash(password,salt);
            user.name= name;
            user.lastname=lastname;
            user.avatar=avatar;
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
            res.status(400).send({error:"❌ Incorrect email or password"});
        }
        const passwordSuccess=await bcrypt.compare(password,user.password);
        if(!passwordSuccess){
            res.status(400).send({error:"❌ Incorrect email or password"});
        }
        res.status(200).send({token: jwt.createToken(user,"24h")});

    } catch (error) {
        next(error);
    }
}

async function getByEmail(req,res,next){
    const email= req.params.email;
    try{
        const user = await User.find({email});
        if(!user){
            res.status(404).send({error:"❌ Cannot found this user"});
        }else{
            res.status(200).send(user);
        }
    }catch(error){
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

                if(!user.contacts.includes(newContact[0]._id)){
                    user.contacts= user.contacts.concat(newContact[0]._id);
                    const chat= new Chat();
                    chat.members=[idUser,newContact[0]._id];
                    await chat.save();
                    user.chats.push(chat._id);
                    newContact[0].chats.push(chat._id);
                    newContact[0].contacts.push(idUser);
                    await User.updateOne(User.findById(newContact[0]._id),newContact[0]);
                    await User.updateOne(User.findById(idUser),user);
                    res.status(200).send({msg:"✅ Contact added to user!"}); 
                }else{
                    res.status(400).send({error:"❌ That contact has already been added previously!"});
                }
           
        }
    }catch(error){
        next(error);
    }
}

async function getFullUserById(req,res,next){
    const idUser= req.params.id;
    try{
        const user= await User.findById(idUser)
        .populate({path:"contacts",model:'User'})
        .populate({path:"chats",model:'Chat'}).exec();
        if(!user){
            res.status(404).send({error:"❌ Cannot get this chat"});
        }else{
            res.status(200).send(user);
        }
    }catch(error){
        next(error);
    }
}

async function editProfile(req,res,next){ 
    const idUser= req.params.id;
    const {name,lastname,email,status}= req.body;
    try{
        const user= await User.findById(idUser);
        if(!user){
            res.status(404).send({error:"❌ Cannot found the user by id"});
        }else{
            user.name=name;
            user.lastname=lastname;
            user.email=email;
            user.status=status;
            await user.save();
            res.status(200).send({msg:"✅ Profile Updated!"}); 
        }
    }catch(error){
        next(error);
    }
}

async function editSettings(req,res,next){ 
    const idUser= req.params.id;
    const {theme,background,bgColor}= req.body;
    try{
        const user= await User.findById(idUser);
        if(!user){
            res.status(404).send({error:"❌ Cannot found the user by id"});
        }else{
            user.theme=theme;
            user.background=background;
            user.bgColor=bgColor;
            await user.save();
            res.status(200).send({msg:"✅ User Settings Updated!"}); 
        }
    }catch(error){
        next(error);
    }
}

function uploadAvatar(req,res,next){
    console.log("fd");
    if(res.status(400)){
        console.log("ccvb");
    }
    const params= req.params;
    User.findById({_id:params.id},(err,userData)=>{
        if(err){
            console.log(err.toString());
            next(err);
        }else{
            
            if(!userData){
                res.status(404).send({error:"❌ Cannot found user!"})
            }else{
                let user = userData;
                console.log(req.files);
                if(req.files){
                    console.log();
                    const filePath=req.files.avatar.path;
                    let fileSplit=filePath.split(path.delimiter)
                    if(fileSplit.length==1){//Porque no me pilla la doble barra invertida
                        fileSplit=filePath.split("\\");
                    }
                    let fileName = fileSplit[0];
                    if(fileName=="uploads"){
                        fileName = fileSplit[1];
                    }
                    let extSplit = fileName.split(".");
                    let fileExt= extSplit[1];
                    console.log(fileName,fileExt,extSplit)
                    if(fileExt!== "png" && fileExt!=="jpg"){
                        res.status(400).send({error:"❌ Image extension is not allowed (Only .png or .jpg)"})
                    }else{
                        user.avatar = fileName;
                        console.log(user);

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
            console.log(err.toString());
            res.status(404).send({error:"❌ Avatar not found."});
            
        }else{
            res.sendFile(path.resolve(filePath));
            
        }
    });
}

module.exports = {
    register,
    login,
    getByEmail,
    getFullUserById,
    addContact,
    editProfile,
    editSettings,
    uploadAvatar,
    getAvatar,
}