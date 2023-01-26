const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const debug = require("debug")("app:debug");
const { Definition, validate } = require("../models/definition");
const express = require("express");
const _ = require("lodash");
const router = express.Router();

// save a new model definition
router.post("/update_definition", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);
  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // is this script already registered?
    let newDefinition = await Definition.findOne({
      engine_version: req.body.engine_version,
      name: req.body.name,
      user: req.body.user,
    });

    if (!newDefinition) {
      // this script does not exist yet so make a new one
      // we have a valid user object so we need to store it in the database
      newDefinition = new Definition(
        _.pick(req.body, [
          "_id",
          "engine_version",
          "name",
          "description",
          "weight",
          "user",
          "protected",
          "shared",
          "models",
        ])
      );
      // add the creation date
      newDefinition["dateCreated"] = Date.now();
      newDefinition["dateUpdated"] = Date.now();

      // save the model definition to the database
      await newDefinition.save();

      res.send('{ "message" : "new" }');

      return;
    }

    // save the model definition to the database
    await newDefinition.updateOne({
      engine_version: req.body.engine_version,
      name: req.body.name,
      description: req.body.description,
      weight: req.body.weight,
      user: req.body.user,
      protected: req.body.protected,
      shared: req.body.shared,
      models: req.body.models,
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
router.post("/get_definition", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);

  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // get the state file
    let foundDefinition = await Definition.find({
      engine_version: req.body.engine_version,
      name: req.body.name,
      user: req.body.user,
    });

    // if not found
    if (!foundDefinition)
      return res.status(400).send("Can't find the definition file.");

    // return the found scripts
    res.send(foundDefinition);
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

// get all definitions for current user  with a specific engine version
router.post("/get_definitions", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);

  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // get the state file
    let foundDefinitions = await Definition.find({
      engine_version: req.body.engine_version,
      user: req.body.user,
    });

    // if not found
    if (!foundDefinitions)
      return res.status(400).send("Can't find any definitions files.");

    // return the found scripts
    res.send(foundDefinitions);
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

// get specific shared definition with a specific engine version
router.post("/get_shared_definition", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);

  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // get the state file
    let foundDefinition = await Definition.find({
      engine_version: req.body.engine_version,
      name: req.body.name,
      shared: req.body.shared,
    });

    // if not found
    if (!foundDefinition)
      return res.status(400).send("Can't find requested definition file.");

    // return the found scripts
    res.send(foundDefinition);
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

// get all shared definitions with a specific engine version
router.post("/get_shared_definitions", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);

  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // get the state file
    let foundDefinitions = await Definition.find({
      engine_version: req.body.engine_version,
      shared: req.body.shared,
    });

    // if not found
    if (!foundDefinitions)
      return res.status(400).send("Can't find any shared definitions files.");

    // return the found scripts
    res.send(foundDefinitions);
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
