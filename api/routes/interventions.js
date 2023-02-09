const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const { Intervention, validate } = require("../models/intervention");
const express = require("express");
const _ = require("lodash");
const router = express.Router();

// save a new model state
router.post("/delete_intervention", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);
  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // is this script already registered?
    let newIntervention = await Intervention.deleteOne({
      name: req.body.name,
      definition: req.body.definition,
      protected: false,
    });

    // send a response to the client without the password or account and with a header containing the webtoken
    if (newIntervention.deletedCount === 0) {
      res.send('{ "message" : "error" }');
    } else {
      res.send('{ "message" : "success" }');
    }
  } catch (ex) {
    res.status(500).send("Internal server error.");
  }
});

router.post("/update_intervention", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);
  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // is this script already registered?
    let newIntervention = await Intervention.findOne({
      name: req.body.name,
    });

    if (!newIntervention) {
      // this script does not exist yet so make a new one
      // we have a valid user object so we need to store it in the database
      newIntervention = new Script(
        _.pick(req.body, [
          "_id",
          "name",
          "description",
          "definition",
          "script",
          "protected",
          "shared",
        ])
      );

      // add the creation date
      newIntervention["dateCreated"] = Date.now();
      newIntervention["dateUpdated"] = Date.now();

      // save the model definition to the database
      await newIntervention.save();

      res.send('{ "message" : "new" }');

      return;
    }

    // save the model definition to the database
    await newIntervention.updateOne({
      script: req.body.script,
      definition: req.body.definition,
      protected: req.body.protected,
      shared: req.body.shared,
      dateUpdated: Date.now(),
    });

    // send a response to the client without the password or account and with a header containing the webtoken
    res.send('{ "message" : "update" }');
  } catch (ex) {
    res.status(500).send("Internal server error.");
  }
});

// get all scripts for the current user
router.post("/get_interventions", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);

  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // get the definition file
    let foundInterventions = await Intervention.find({
      definition: req.body.definition,
    });

    // if not found
    if (!foundInterventions)
      return res.status(400).send("Can't find intervention file.");

    // return the found scripts
    res.send(foundInterventions);
  } catch (ex) {
    res.status(500).send("Internal server error.");
  }
});

// get a specific script for this user
router.post("/get_intervention", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);

  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // get the state file
    let foundIntervention = await Script.findOne({
      name: req.body.name,
      definition: req.body.definition,
    });

    // if not found
    if (!foundIntervention)
      return res.status(400).send("Can't find definition file.");

    // return the found script
    res.send(foundIntervention);
  } catch (ex) {
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
