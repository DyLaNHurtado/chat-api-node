const express = require('express');
const multipart = require('connect-multiparty');
const UserController=require('../controllers/user');
//[md_auth.ensureAuth]
const md_auth = require("../middlewares/authenticated");
const md_upload_avatar = multipart({uploadDir: "./uploads"});

const api = express.Router();

api.post("/user/register",UserController.register);
api.post("/user/login",UserController.login);
api.get("/user/:email",UserController.getByEmail);
api.get("/user/full-data/:id",UserController.getFullUserById);
api.put("/user/add-contact/:id",UserController.addContact);
api.put("/user/edit-profile/:id",UserController.editProfile);
api.put("/user/edit-settings/:id",UserController.editSettings);
api.put("/user/upload-avatar/:id",[md_upload_avatar],UserController.uploadAvatar);
api.get("/user/avatar/:avatarName",[md_upload_avatar],UserController.getAvatar);

module.exports = api;
