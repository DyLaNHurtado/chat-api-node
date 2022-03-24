const fs = require('fs');
const path = require("path");
const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('../service/jwt');


async function register(req,res){
    const user = new User();
    const {email,password} = req.body;
    try {
        if(!email || !password){
            throw{msg:"Rellene los campos para registrarse"};
        }
            const foundEmail = await User.findOne({email});
            if(foundEmail){throw{msg:"El email ya esta en uso."}}
            const salt = bcrypt.genSaltSync(10);
            user.email=email;
            user.password= await bcrypt.hash(password,salt);
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

async function protected(req,res){
    try {
        console.log("sfkdf");

    } catch (error) {
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
    protected,
    uploadAvatar,
    getAvatar,
}