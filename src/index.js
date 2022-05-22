require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const chalk = require("chalk");

const { MONGO_DB_URI, MONGO_DB_TEST_URI, NODE_ENV } = process.env;
const PORT = process.env.PORT;

const connectionString = NODE_ENV === "test" ? MONGO_DB_TEST_URI : MONGO_DB_URI;

mongoose.connect(
  connectionString,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    try {
      if (err) {
        throw err;
      } else {
        console.log(
          `\n>> ${chalk.bold.green("MongoDB connection successful!")} \n`
        );
        app.listen(PORT, () => {
          console.log(
            `>> ${chalk.bold.blue(
              "API Rest is listening at"
            )}  ${chalk.bold.yellow("http://localhost:" + PORT + "...")}`
          );
        });
        const server = require("./server");
      }
    } catch (error) {
      console.error(error);
    }
  }
);
