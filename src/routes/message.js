const express = require("express");
const MessageController = require("../controllers/message");

const api = express.Router();

api.get("/message/chat/:id", MessageController.getAllByChat);
api.get("/message/:id", MessageController.getById);
api.post("/message", MessageController.postMessage);
api.put("/message/:id", MessageController.putMessage);
api.delete("/message/:id", MessageController.deleteMessage);
api.get("/message/last/audio/", MessageController.getLastAudioMessage);

module.exports = api;
