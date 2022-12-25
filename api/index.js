const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const config = require("config");
const debug = require("debug")("app:debug");
const cors = require("cors");
const _ = require("lodash");
const { default: mongoose } = require("mongoose");

// detect the enviroment in which node is running (= same as process.env.NODE_ENV)
if (config.get("mode") === "development") {
  // enabled the debugger
  debug.enabled = true;
  // log the requests
  app.use(morgan("tiny"));
  debug("Morgan enabled.");
}

// check whether the environment variables are set
if (!config.get("jwtPrivateKey")) {
  debug("FATAL ERROR: jwtPrivateKey is not set.");
  process.exit(1);
}

if (!config.get("db_pw")) {
  debug("FATAL ERROR: mongoDB password is not set.");
  process.exit(1);
}

// parse the req.body from a JSON to JS object
app.use(express.json());

// use cors
app.use(
  cors({
    origin: "*",
  })
);

// serve the static content from the public folder
app.use(express.static("public"));

// secure the request header
app.use(helmet());

// connect to the database
const connectionString = `mongodb+srv://${config.get("db_user")}:${config.get(
  "db_pw"
)}@explain-db-5e60470c.mongo.ondigitalocean.com/${config.get(
  "db_database"
)}?tls=true&authSource=admin&replicaSet=explain-db`;

// remove warning
mongoose.set("strictQuery", true);

// connect to the mongoDB server
mongoose
  .connect(connectionString)
  .then(() => {
    debug("MongoDB database connected");
  })
  .catch((err) => debug(err));

// start the express server
const port = parseInt(config.get("port"));
app.listen(port, () => {
  debug(`Server is listening on port ${port}.`);
});
