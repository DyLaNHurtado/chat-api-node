const moment = require('moment');
const jwt = require('../service/jwt');

const SECRET_KEY="K3jlkds9KSD099kjsdf8ij32h290kjl";
function ensureAuth(req,res,next){
    if(!req.headers.authorization){
        return res
        .status(403)
        .send({msg:"La peticion no tiene la cabecera de Autenticacion"});
    }
    const token = req.headers.authorization.replace(/['"]+/g,"");
    const payload = jwt.decodeToken(token,SECRET_KEY);
    try {
        
        if(payload.exp <= moment().unix()){
            return res.status(400).send({msg:"Token expirado"});
        }
    } catch (error) {
        return res.status(400).send({msg:"Token no valido"})
    }

    req.user=payload;
    next();
}
module.exports={
    ensureAuth,
}
