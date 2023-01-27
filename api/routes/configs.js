const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const debug = require("debug")("app:debug");
const { Config, validate } = require("../models/config");
const express = require("express");
const _ = require("lodash");
const router = express.Router();

// save a new model definition
router.post("/update_config", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);
  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // is this script already registered?
    let newConfig = await Config.findOne({
      user: req.body.user,
      engine_version: req.body.engine_version,
    });

    if (!newConfig) {
      // this script does not exist yet so make a new one
      // we have a valid user object so we need to store it in the database
      newConfig = new Config(
        _.pick(req.body, [
          "_id",
          "user",
          "engine_version",
          "definition",
          "models",
          "groupers",
          "charts",
          "monitors",
        ])
      );
      // add the creation date
      newConfig["dateCreated"] = Date.now();
      newConfig["dateUpdated"] = Date.now();

      // save the model definition to the database
      await newConfig.save();

      res.send('{ "message" : "new" }');

      return;
    }

    // save the model definition to the database
    await newConfig.updateOne({
      engine_version: req.body.engine_version,
      user: req.body.user,
      definition: req.body.definition,
      models: req.body.models,
      groupers: req.body.groupers,
      charts: req.body.charts,
      monitors: req.body.monitors,
      dateUpdated: Date.now(),
    });

    // send a response to the client without the password or account and with a header containing the webtoken
    res.send('{ "message" : "update" }');
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

// get specific definition for the current user with a specific engine version
router.post("/get_config", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);

  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // get the state file
    let foundConfig = await Config.findOne({
      engine_version: req.body.engine_version,
      user: req.body.user,
    });

    // if not found
    if (!foundConfig)
      return res.status(400).send("Can't find the config file.");

    // return the found scripts
    res.send(foundConfig);
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
