const express = require("express");
const ChatController = require("../controllers/chat");
const multipart = require("connect-multiparty");
const md_upload_file = multipart({ uploadDir: "./uploads" });

const api = express.Router();

api.get("/chat", ChatController.getAll);
api.get("/chat/:id", ChatController.getById);
api.put("/chat/:id", ChatController.putChat);
api.delete("/chat/:id", ChatController.deleteMessageChat);
api.put("/chat/upload-image/:idChat/:idUser", [md_upload_file], ChatController.uploadImage);
api.put("/chat/upload-audio/:idChat/:idUser", [md_upload_file], ChatController.uploadAudio);
api.put("/chat/upload-video/:idChat/:idUser", [md_upload_file], ChatController.uploadVideo);

module.exports = api;
