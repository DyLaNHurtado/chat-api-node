const Message = require("../models/message");
const Chat = require("../models/chat");
const { find, findById } = require("../models/message");
const message = require("../models/message");

async function getById(req, res, next) {
  const idMessage = req.params.id;
  try {
    const message = await Message.findById(idMessage);
    if (!message) {
      res.status(404).send({ error: "❌ Cannot found this message" });
    } else {
      res.status(200).send(message);
    }
  } catch (error) {
    next(error);
  }
}

async function postMessage(req, res, next) {
  const message = new Message();
  const params = req.body;
  message.text = params.text;
  message.author = params.author;
  message.chat = params.chat;
  message.time = params.time;
  if (message.text && message.author && message.chat && message.time) {
    try {
      const messageSaved = await message.save();

      if (!messageSaved) {
        res.status(404).send({ error: "❌ Cannot save this message" });
      } else {
        const chat = await Chat.findById(params.chat);
        if (chat) {
          chat.messages.push(messageSaved._id);
          await chat.save();
          res.status(200).send(messageSaved);
        } else {
          res.status(400).send({ error: "❌ Id of chat incorrect" });
        }
      }
    } catch (error) {
      next(error);
    }
  } else {
    res.status(400).send({
      error:
        "❌ Missing fields to post the message (Fields: text(notEmpty) | author(id) | chat(id) )",
    });
  }
}

async function putMessage(req, res, next) {
  const idMessage = req.params.id;
  const params = req.body;
  try {
    const message = await Message.findByIdAndUpdate(idMessage, params);
    if (!message) {
      res.status(404).send({ error: "❌ Cannot update this message" });
    } else {
      res.status(200).send({ msg: "✅ Update successful !" });
    }
  } catch (error) {
    next(error);
  }
}

async function getAllByChat(req, res) {
  const idChat = req.params.id;

  try {
    const messages = await Message.find({ chat: idChat }).sort({
      created_at: -1,
    });

    if (!messages) {
      return res.status(404).send({ error: "❌ There are not messages" });
    } else {
      const chat = await Chat.findById(idChat);
      if (chat) {
        res.status(200).send(messages);
      } else {
        return res.status(404).send({ error: "❌ Cannot find the chat" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

async function deleteMessage(req, res, next) {
  const idMessage = req.params.id;
  try {
    const message = await Message.findByIdAndDelete(idMessage);
    if (!message) {
      res.status(404).send({ error: "❌ Cannot found this message" });
    } else {
      res.status(200).send({ msg: "✅ Successful delete !" });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllByChat,
  getById,
  postMessage,
  putMessage,
  deleteMessage,
};
