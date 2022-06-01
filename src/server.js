const express = require("express");
const app = express("./app");
const server = require("http").createServer(app);
const chalk = require("chalk");
const io = require("socket.io")(server, {
  cors: {
    origins: ["http://localhost:4200/**", "http://localhost:5000/**"],
  },
});

server.listen(5000, function () {
  console.log(
    `\n>> ${chalk.bold.magenta(
      "WebSockets are listening at port:"
    )}  ${chalk.bold.yellow(5000)}\n`
  );
});
let usersConnected = [];
io.on("connection", function (socket) {
  let { payload } = socket.handshake.query;

  if (!payload) {
    console.log(`${chalk.red(`Sin payload`)}`);
  } else {
    const userId = JSON.parse(payload).id;
    const userEmail = JSON.parse(payload).email;
    const userChats = JSON.parse(payload).chats;
    console.log(
      chalk.bold.magenta("User connected: " + userId + " >> ") +
        chalk.bold.blue(userEmail)
    );

    if (userChats.length != 0) {
      for (let chat of userChats) {
        socket.join(`chat_${chat}`);
        console.log(
          `${
            chalk.yellow(`* ${userEmail} has joined to >> `) +
            `${`chat_${chat}`}`
          }`
        );
      }
    }
    socket.broadcast.emit("userConnected", userId);

    socket.on("askWhoAreConnected", (name) => {
      usersConnected.push(name);
      usersConnected = [...new Set(usersConnected)];
      socket.emit("anwserWhoAreConnected", usersConnected);
    });

    socket.on("onInputFocus", (idChat) => {
      socket.to(`chat_${idChat}`).emit("writting");
    });

    socket.on("onInputNotFocus", (idChat) => {
      socket.to(`chat_${idChat}`).emit("notWritting");
    });

    socket.on("messageSent", (idChat, userId) => {
      socket.to(`chat_${idChat}`).emit("newMessage");
      socket.to(`chat_${idChat}`).emit("messageSentCL", idChat, userId);
    });
  }

  socket.on("removeConnected", (name) => {
    let index = usersConnected.indexOf(name);
    if (index !== -1) {
      usersConnected.splice(index, 1);
    }
  });

  socket.on("disconnect", function () {
    if (socket.handshake.query.payload) {
      console.log(
        "User disconnected >>",
        chalk.bold.blue(JSON.parse(socket.handshake.query.payload).email)
      );
      socket.broadcast.emit(
        "userDisconnected",
        JSON.parse(socket.handshake.query.payload).id,
        usersConnected
      );
    }
  });
});
