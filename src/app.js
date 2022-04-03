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
const notFound = require('./middlewares/notFound');
const handleErrors = require('./middlewares/handleErrors');

// --- Base Routes ---
app.use(process.env.API_MAINENDPOINT,user_routes);
app.use(process.env.API_MAINENDPOINT,message_routes);
app.use(process.env.API_MAINENDPOINT,chat_routes);
// Middlewares
app.use(notFound);
app.use(handleErrors)

module.exports=app;