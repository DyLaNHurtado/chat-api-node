const moment = require('moment');
const jwt = require('../services/jwt');

const SECRET_KEY=process.env.SECRET_KEY;
function ensureAuth(req,res,next){
    if(!req.headers.authorization){
        return res
        .status(403)
        .send({error:"❌ The request does not have the Authentication header"});
    }
    const token = req.headers.authorization.replace(/['"]+/g,"");
    console.log(token);
    const payload = jwt.decodeToken(token,SECRET_KEY);
    try {
        if(payload.exp <= moment().unix()){
            return res.status(400).send({error:"❌ Expired token!"});
        }
    } catch (error) {
        return res.status(400).send({error:"❌ Invalid token! "})
    }

    req.user=payload;
    next();
}
module.exports={
    ensureAuth,
}