const jwt = require("jsonwebtoken");
const SECRET_KEY="K3jlkds9KSD099kjsdf8ij32h290kjl";

function createToken(user,expiresIn){
    const {id,email} =user;
    const payload={id,email};
    return jwt.sign(payload,SECRET_KEY,{expiresIn});
}
function decodeToken(token){
    return jwt.decode(token,SECRET_KEY);
}
module.exports={
    createToken,
    decodeToken,
}