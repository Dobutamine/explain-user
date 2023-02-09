const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const { Case, validate } = require("../models/case");
const express = require("express");
const _ = require("lodash");
const router = express.Router();

// save a new model state
router.post("/delete_case", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);
  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // is this script already registered?
    let newCase = await Case.deleteOne({
      name: req.body.name,
      protected: false,
    });

    // send a response to the client without the password or account and with a header containing the webtoken
    if (newCase.deletedCount === 0) {
      res.send('{ "message" : "error" }');
    } else {
      res.send('{ "message" : "success" }');
    }
  } catch (ex) {
    res.status(500).send("Internal server error.");
  }
});

router.post("/update_case", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);
  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // is this script already registered?
    let newCase = await Case.findOne({
      name: req.body.name,
    });

    if (!newCase) {
      // this script does not exist yet so make a new one
      // we have a valid user object so we need to store it in the database
      newCase = new Script(
        _.pick(req.body, [
          "_id",
          "name",
          "description",
          "definition",
          "scripts",
          "protected",
          "shared",
        ])
      );

      // add the creation date
      newCase["dateCreated"] = Date.now();
      newCase["dateUpdated"] = Date.now();

      // save the model definition to the database
      await newCase.save();

      res.send('{ "message" : "new" }');

      return;
    }

    // save the model definition to the database
    await newCase.updateOne({
      scripts: req.body.scripts,
      description: req.body.description,
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
router.post("/get_cases", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);

  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // get the definition file
    let foundCases = await Case.find({
      name: req.body.name,
    });

    // if not found
    if (!foundCases) return res.status(400).send("Can't find case file.");

    // return the found scripts
    res.send(foundCases);
  } catch (ex) {
    res.status(500).send("Internal server error.");
  }
});

// get a specific script for this user
router.post("/get_case", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);

  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // get the state file
    let foundCase = await Case.findOne({
      name: req.body.name,
    });

    // if not found
    if (!foundCase) return res.status(400).send("Can't find case file.");

    // return the found script
    res.send(foundCase);
  } catch (ex) {
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
