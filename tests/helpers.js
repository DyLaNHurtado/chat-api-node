const supertest = require("supertest");
const app = require("../src/app");

const api = supertest(app);

const initialMessages = [
  {
    _id: "6240ca631d96533689250ae0",
    text: "Hello",
    author: "6240ca2d979f14638d359a29",
    chat: "6240ca3cc8e3bae427c75cc4",
  },
  {
    _id: "6240cab4bb113bb56ebb0b27",
    text: "GoodBye",
    author: "6240ca2d979f14638d359a29",
    chat: "6240ca3cc8e3bae427c75cc4",
  },
];

const initialChats = [
  {
    _id: "6240ca3cc8e3bae427c75cc4",
    members: ["6240ca2d979f14638d359a29", "6248a1eba0c40556662d022f"],
    messages: ["6240cab4bb113bb56ebb0b27"],
  },
  {
    _id: "6240ca631d96533689250ae0",
    members: ["6240ca2d979f14638d359a29", "6248a1eba0c40556662d022f"],
    messages: ["6240ca631d96533689250ae0"],
  },
];

const initialUsers = [
  {
    _id: "6240ca2d979f14638d359a29",
    name: "Pedro",
    lastname: "PicaPiedra",
    email: "pedro@picapiedra.com",
    password: "$2a$12$1cXvEFLpaInTf04QR7DK1OVTBBBA1EQ35EuG4XYEowtABihSrBXku",
    status: "YAVADAVADUU",
    avatar: "",
    contacts: [],
    chats: [],
  },
  {
    _id: "6248a1eba0c40556662d022f",
    name: "Vinicius",
    lastname: "Jr",
    email: "vini@viniciusjr.com",
    password: "$2a$12$1cXvEFLpaInTf04QR7DK1OVTBBBA1EQ35EuG4XYEowtABihSrBXku",
    status: "SIIUUUU",
    avatar: "",
    contacts: [],
    chats: [],
  },
];
module.exports = {
  initialMessages,
  initialChats,
  initialUsers,
  api,
};
