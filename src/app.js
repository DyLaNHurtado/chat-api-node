const express = require('express');
const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({extended:true}));
// --- Load Data ---
const user_routes = require('./routes/user');
const message_routes = require('./routes/message');
const chat_routes = require('./routes/chat');
const res = require('express/lib/response');
const notFound = require('./middlewares/notFound');
const handleErrors = require('./middlewares/handleErrors');

// --- Base Routes ---
app.use("/api/v1/",user_routes);
app.use("/api/v1/",message_routes);
app.use("/api/v1/",chat_routes);
// Middlewares
app.use(notFound);
app.use(handleErrors)

module.exports=app;