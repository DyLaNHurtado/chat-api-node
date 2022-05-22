const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

function createToken(user, expiresIn) {
  const { id, email, chats } = user;
  console.log(user);
  const payload = { id, email, chats };
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}
function decodeToken(token) {
  return jwt.decode(token, SECRET_KEY);
}
module.exports = {
  createToken,
  decodeToken,
};
