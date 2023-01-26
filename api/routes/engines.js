const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const debug = require("debug")("app:debug");
const { Engine, validate } = require("../models/engine");
const express = require("express");
const _ = require("lodash");
const router = express.Router();

// save a new model state
router.post("/update_engine", auth, admin, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);
  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // is this script already registered?
    let newEngine = await Engine.findOne({
      engine_version: req.body.engine_version,
    });

    if (!newEngine) {
      // this script does not exist yet so make a new one
      // we have a valid user object so we need to store it in the database
      newEngine = new Engine(
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
      newEngine["dateCreated"] = Date.now();
      newEngine["dateUpdated"] = Date.now();

      // save the model definition to the database
      await newEngine.save();

      res.send('{ "engine" : "new" }');

      return;
    }

    // save the model definition to the database
    await newEngine.updateOne({
      engine_version: req.body.engine_version,
      modeling_stepsize: req.body.modeling_stepsize,
      base_model_settings: req.body.base_model_settings,
      active_experimental_models: req.body.active_experimental_models,
      core_models: req.body.core_models,
      experimental_models: req.body.experimental_models,
      dateUpdated: Date.now(),
    });

    // send a response to the client without the password or account and with a header containing the webtoken
    res.send('{ "engine" : "update" }');
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
