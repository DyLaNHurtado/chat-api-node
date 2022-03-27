const express = require('express');
const ChatController=require('../controllers/chat');

const api = express.Router();

api.get("/chat",ChatController.getAll);
api.get("/chat/:id",ChatController.getById);
api.put("/chat/:id",ChatController.putChat);
api.delete("/chat/:id",ChatController.deleteChat);

module.exports = api;