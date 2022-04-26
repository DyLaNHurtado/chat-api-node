const express = require('express');
const multipart = require('connect-multiparty');
const UserController=require('../controllers/user');

const md_auth = require("../middlewares/authenticated");
const md_upload_avatar = multipart({uploadDir: "./uploads"});

const api = express.Router();

api.post("/user/register",UserController.register);
api.post("/user/login",UserController.login);
api.get("/user/:email",UserController.getByEmail);
api.put("/user/add-contact/:id",[md_auth.ensureAuth],UserController.addContact);
api.put("/user/upload-avatar/:id",[md_upload_avatar],UserController.uploadAvatar);
api.get("/user/avatar/:avatarName",[md_upload_avatar],UserController.getAvatar);

module.exports = api;
