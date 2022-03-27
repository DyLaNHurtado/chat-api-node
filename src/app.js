const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// --- Load Data ---
const user_routes = require('./routes/user');
const message_routes = require('./routes/message');
const chat_routes = require('./routes/chat');

// --- Base Routes ---
app.use("/api/v1/",user_routes);
app.use("/api/v1/",message_routes);
app.use("/api/v1/",chat_routes);

module.exports=app;