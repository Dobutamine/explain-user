const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const { ModelDefinition, validate } = require("../models/model_definition");
const express = require("express");
const _ = require("lodash");
const router = express.Router();

// save a new model definition
router.post("/new_def", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);
  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // is this definition already registered?
    let definition = await ModelDefinition.findOne({ name: req.body.name });
    if (definition)
      return res.status(400).send("Model definition exists already.");

    // we have a valid user object so we need to store it in the database
    definition = new ModelDefinition(
      _.pick(req.body, ["_id", "name", "owner", "model"])
    );

    // save the model definition to the database
    await definition.save();

    // send a response to the client without the password or account and with a header containing the webtoken
    res.send(_.pick(definition, ["_id", "name", "owner", "model"]));
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

router.post("/get_def", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);
  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // get the definition file
    let definition = await ModelDefinition.findOne({ name: req.body.name });

    // if not found
    if (!definition)
      return res.status(400).send("Can't find model definition file.");

    // check whether the current user is in the owner name list

    res.send(_.pick(definition, ["_id", "name", "owner", "model"]));
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
