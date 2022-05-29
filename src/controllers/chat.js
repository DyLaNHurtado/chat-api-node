const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/message");
const path = require("path");

async function getAll(req, res, next) {
  try {
    const chats = await Chat.find({})
      .populate({ path: "messages", model: "Message" })
      .populate({ path: "members", model: "User" })
      .exec();

    res.status(200).send(chats);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  const idChat = req.params.id;
  try {
    const chat = await Chat.findById(idChat)
      .populate({ path: "messages", model: "Message" })
      .populate({ path: "members", model: "User" })
      .exec();
    if (!chat) {
      res.status(404).send({ error: "❌ Cannot get this chat" });
    } else {
      res.status(200).send(chat);
    }
  } catch (error) {
    next(error);
  }
}

async function deleteMessageChat(req, res, next) {
  const idChat = req.params.id;
  try {
    const chat = await Chat.findById(idChat);
    chat.messages = [];
    await chat.save();
    await Message.deleteMany({ chat: idChat });
    if (!chat) {
      res.status(404).send({ error: "❌ Cannot delete this chat" });
    } else {
      res.status(200).send({ msg: "✅ Successful delete !" });
    }
  } catch (error) {
    next(error);
  }
}

async function putChat(req, res, next) {
  const idChat = req.params.id;
  const params = req.body;
  try {
    const chat = await Chat.findByIdAndUpdate(idChat, params);
    if (!chat) {
      res.status(404).send({ error: "❌ Cannot found this chat" });
    } else {
      res.status(200).send({ msg: "✅ Successful update!" });
    }
  } catch (error) {
    next(error);
  }
}

async function uploadVideo(req, res, next) {
  console.log("fd");
  if (res.status(400)) {
    console.log("ccvb");
  }
  const params = req.params;
  console.log(params);
  const user = await User.findById(params.idUser);
  if(user){
  Chat.findById(params.idChat, async (err, chatData) => {
    if (err) {
      console.log(err.toString());
      next(err);
    } else {
      if (!chatData) {
        res.status(404).send({ error: "❌ Cannot found chat!" });
      } else {
        let chat = chatData;
        console.log(req.files);
        if (req.files) {
          console.log();
          const filePath = req.files.video.path;
          let fileSplit = filePath.split(path.delimiter);
          if (fileSplit.length == 1) {
            //Porque no me pilla la doble barra invertida
            fileSplit = filePath.split("\\");
          }
          let fileName = fileSplit[0];
          if (fileName == "uploads") {
            fileName = fileSplit[1];
          }
          let extSplit = fileName.split(".");
          let fileExt = extSplit[1];
          console.log(fileName, fileExt, extSplit);
            let newMessage = new Message();
            newMessage.type = "video";
            newMessage.url = fileName;
            newMessage.chat = chat._id;
            newMessage.time = `${('0'+(new Date().getHours())).slice(-2)}:${('0'+(new Date().getMinutes())).slice(-2)}`;
            newMessage.author = params.idUser;

            await newMessage.save();
            chat.messages.push(newMessage._id);
            console.log(chat);
            const chatResult = await Chat.updateOne(
              Chat.findById(chat._id),
              chat
            );
            console.log(chatResult);
            if (!chatResult) {
              res.status(404).send({ error: "❌ Cannot found chat!" });
            } else {
              res.status(200).send({ msg: "✅ Video uploaded!" });
            }
        }
      }
    }
  });}else{
    res.status(400).send({error: "❌ Cannot found user!" })
  }
}

async function uploadAudio(req, res, next) {
  console.log("fd");
  if (res.status(400)) {
    console.log("ccvb");
  }
  const params = req.params;
  console.log(params);
  const user = await User.findById(params.idUser);
  if(user){
  Chat.findById(params.idChat, async (err, chatData) => {
    if (err) {
      console.log(err.toString());
      next(err);
    } else {
      if (!chatData) {
        res.status(404).send({ error: "❌ Cannot found chat!" });
      } else {
        let chat = chatData;
        console.log(req.files);
        if (req.files) {
          console.log();
          const filePath = req.files.audio.path;
          let fileSplit = filePath.split(path.delimiter);
          if (fileSplit.length == 1) {
            //Porque no me pilla la doble barra invertida
            fileSplit = filePath.split("\\");
          }
          let fileName = fileSplit[0];
          if (fileName == "uploads") {
            fileName = fileSplit[1];
          }
          let extSplit = fileName.split(".");
          let fileExt = extSplit[1];
          console.log(fileName, fileExt, extSplit);
          if (fileExt !== "webm" && fileExt !== "mp3") {
            res.status(400).send({
              error: "❌ Audio extension is not allowed (Only .webm or .mp3)",
            });
          } else {
            let newMessage = new Message();
            newMessage.type = "audio";
            newMessage.url = fileName;
            newMessage.chat = chat._id;
            newMessage.time = `${('0'+(new Date().getHours())).slice(-2)}:${('0'+(new Date().getMinutes())).slice(-2)}`;
            newMessage.author = params.idUser;

            await newMessage.save();
            chat.messages.push(newMessage._id);
            console.log(chat);
            const chatResult = await Chat.updateOne(
              Chat.findById(chat._id),
              chat
            );
            console.log(chatResult);
            if (!chatResult) {
              res.status(404).send({ error: "❌ Cannot found chat!" });
            } else {
              res.status(200).send({ msg: "✅ Audio uploaded!" });
            }
          }
        }
      }
    }
  });}else{
    res.status(400).send({error: "❌ Cannot found user!" })
  }
}


async function uploadImage(req, res, next) {
  console.log("fd");
  if (res.status(400)) {
    console.log("ccvb");
  }
  const params = req.params;
  const user = await User.findById(params.idUser);
  if(user){
  Chat.findById(params.idChat, async (err, chatData)  => {
    if (err) {
      console.log(err.toString());
      next(err);
    } else {
      if (!chatData) {
        res.status(404).send({ error: "❌ Cannot found user!" });
      } else {
        let chat = chatData;
        console.log(req.files);
        if (req.files) {
          console.log();
          const filePath = req.files.image.path;
          let fileSplit = filePath.split(path.delimiter);
          if (fileSplit.length == 1) {
            //Porque no me pilla la doble barra invertida
            fileSplit = filePath.split("\\");
          }
          let fileName = fileSplit[0];
          if (fileName == "uploads") {
            fileName = fileSplit[1];
          }

          let newMessage = new Message();
            newMessage.type = "image";
            newMessage.url = fileName;
            newMessage.chat = chat._id;
            newMessage.time = `${('0'+(new Date().getHours())).slice(-2)}:${('0'+(new Date().getMinutes())).slice(-2)}`;
            newMessage.author = params.idUser

            await newMessage.save();
            chat.messages.push(newMessage._id);
            console.log(chat);

            const chatResult = await Chat.updateOne(
              Chat.findById(chat._id),
              chat
            );
            if (!chatResult) {
              res.status(404).send({ error: "❌ Cannot found chat!" });
            } else {
              res.status(200).send({ msg: "✅ Image uploaded!" });
            }
        }
      }
    }
  });}
}

module.exports = {
  getAll,
  getById,
  putChat,
  deleteMessageChat,
  uploadAudio,
  uploadVideo,
  uploadImage
};
