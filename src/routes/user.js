const express = require('express');
const multipart = require('connect-multiparty');
const UserController=require('../controller/user');

const md_auth = require("../middleware/authenticated");
const md_upload_avatar = multipart({uploadDir: "./uploads"});

const api = express.Router();

api.post("/register",UserController.register);
api.post("/login",UserController.login);
api.get("/protected",[md_auth.ensureAuth],UserController.protected);
api.put("/upload-avatar/:id",[md_auth.ensureAuth,md_upload_avatar],UserController.uploadAvatar);
api.get("/avatar/:avatarName",[md_auth.ensureAuth,md_upload_avatar],UserController.getAvatar);

module.exports = api;
