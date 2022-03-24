const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// --- Load Data ---
const user_routes = require('./routes/user');

// --- Base Routes ---
app.use("/api/v1/",user_routes);

module.exports=app;