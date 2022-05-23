const express = require("express");
const multipart = require("connect-multiparty");
const UserController = require("../controllers/user");
const md_upload_file = multipart({ uploadDir: "./uploads" });

const api = express.Router();

api.post("/user/register", UserController.register);
api.post("/user/login", UserController.login);
api.get("/user/:email", UserController.getByEmail);
api.get("/user/full-data/:id", UserController.getFullUserById);
api.put("/user/add-contact/:id", UserController.addContact);
api.put("/user/edit-profile/:id", UserController.editProfile);
api.put("/user/edit-settings/:id", UserController.editSettings);
api.put("/user/upload-image/:id", [md_upload_file], UserController.uploadImage);
api.put("/user/upload-media/:idChat/:idUser", [md_upload_file], UserController.uploadMedia);
api.get("/user/file/:fileName", [md_upload_file], UserController.getFile);

module.exports = api;
