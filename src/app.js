const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const options = {
  cors: {
    origin: "http://localhost:4200/** http://localhost:8888/**",
  },
};


const optionsSwagger = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "LogRocket Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "LogRocket",
        url: "https://logrocket.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8888/api/v1/user",
      },
    ],
  },
  apis: ["./routes/*.js"],
};


app.use(express.urlencoded({ extended: true }));
// --- Load Data ---
const user_routes = require("./routes/user");
const message_routes = require("./routes/message");
const chat_routes = require("./routes/chat");
const notFound = require("./middlewares/notFound");
const handleErrors = require("./middlewares/handleErrors");

// --- Base Routes ---
app.use(process.env.API_MAINENDPOINT, user_routes);
app.use(process.env.API_MAINENDPOINT, message_routes);
app.use(process.env.API_MAINENDPOINT, chat_routes);
// --- Middlewares ---
app.use(notFound);
app.use(handleErrors);
// --- Memory space fixed ---
var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
module.exports = app;
