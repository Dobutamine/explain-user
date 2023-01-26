const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const debug = require("debug")("app:debug");
const { Setting, validate } = require("../models/setting");
const express = require("express");
const _ = require("lodash");
const router = express.Router();

// save a new model state
router.post("/update_setting", auth, admin, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);
  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // is this script already registered?
    let newSetting = await Setting.findOne({
      engine_version: req.body.engine_version,
    });

    if (!newSetting) {
      // this script does not exist yet so make a new one
      // we have a valid user object so we need to store it in the database
      newSetting = new Setting(
        _.pick(req.body, [
          "_id",
          "engine_version",
          "modeling_stepsize",
          "base_model_settings",
          "active_experimental_models",
          "core_models",
          "experimental_models",
        ])
      );
      // add the creation date
      newSetting["dateCreated"] = Date.now();
      newSetting["dateUpdated"] = Date.now();

      // save the model definition to the database
      await newSetting.save();

      res.send('{ "setting" : "new" }');

      return;
    }

    // save the model definition to the database
    await newSetting.updateOne({
      engine_version: req.body.engine_version,
      modeling_stepsize: req.body.modeling_stepsize,
      base_model_settings: req.body.base_model_settings,
      active_experimental_models: req.body.active_experimental_models,
      core_models: req.body.core_models,
      experimental_models: req.body.experimental_models,
      dateUpdated: Date.now(),
    });

    // send a response to the client without the password or account and with a header containing the webtoken
    res.send('{ "setting" : "update" }');
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

// get all scripts for the current user
router.post("/get_diagrams", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);

  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // get the state file
    let foundDiagrams = await Diagram.find({ user: req.body.user });

    // if not found
    if (!foundDiagrams) return res.status(400).send("Can't find diagram file.");

    // return the found scripts
    res.send(foundDiagrams);
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

// get a specific diagram for this user
router.post("/get_diagram", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);

  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // get the state file
    let foundDiagram = await Diagram.findOne({
      name: req.body.name,
      user: req.body.user,
    });

    // if not found
    if (!foundDiagram) return res.status(400).send("Can't find diagram file.");

    // return the found script
    res.send(foundDiagram);
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
