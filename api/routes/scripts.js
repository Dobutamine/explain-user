const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const { Script, validate } = require("../models/script");
const express = require("express");
const _ = require("lodash");
const router = express.Router();

// save a new model state
router.post("/delete_script", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);
  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // is this script already registered?
    let newScript = await Script.deleteOne({
      name: req.body.name,
      user: req.body.user,
      protected: false,
    });

    // send a response to the client without the password or account and with a header containing the webtoken
    if (newScript.deletedCount === 0) {
      res.send('{ "message" : "error" }');
    } else {
      res.send('{ "message" : "success" }');
    }
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

router.post("/update_script", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);
  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // is this script already registered?
    let newScript = await Script.findOne({
      name: req.body.name,
      user: req.body.user,
    });

    if (!newScript) {
      // this script does not exist yet so make a new one
      // we have a valid user object so we need to store it in the database
      newScript = new Script(
        _.pick(req.body, [
          "_id",
          "user",
          "name",
          "script",
          "protected",
          "shared",
        ])
      );

      // add the creation date
      newScript["dateCreated"] = Date.now();
      newScript["dateUpdated"] = Date.now();

      // save the model definition to the database
      await newScript.save();

      res.send('{ "message" : "new" }');

      return;
    }

    // save the model definition to the database
    await newScript.updateOne({
      script: req.body.script,
      protected: req.body.protected,
      shared: req.body.shared,
      dateUpdated: Date.now(),
    });

    // send a response to the client without the password or account and with a header containing the webtoken
    res.send('{ "message" : "update" }');
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

// save a new model state
router.post("/new_script", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);
  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // is this script already registered?
    let newScript = await Script.findOne({ name: req.body.name });
    if (newScript) return res.status(400).send("Scriptname exists already.");

    // we have a valid user object so we need to store it in the database
    newScript = new Script(
      _.pick(req.body, ["_id", "user", "name", "script", "protected", "shared"])
    );

    // add the creation date
    newScript["dateCreated"] = Date.now();
    newScript["dateUpdated"] = Date.now();

    // save the model definition to the database
    await newScript.save();

    // send a response to the client without the password or account and with a header containing the webtoken
    res.send(
      _.pick(newScript, [
        "_id",
        "user",
        "name",
        "script",
        "protected",
        "shared",
      ])
    );
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

// get all scripts for the current user
router.post("/get_scripts", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);

  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // get the state file
    let foundScripts = await Script.find({
      $or: [{ user: req.body.user }, { shared: true }],
    });

    // if not found
    if (!foundScripts) return res.status(400).send("Can't find script file.");

    // return the found scripts
    res.send(foundScripts);
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

// get a specific script for this user
router.post("/get_script", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);

  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // get the state file
    let foundScript = await Script.findOne({
      $or: [
        { name: req.body.name, user: req.body.user },
        { name: req.body.name, shared: true },
      ],
    });

    // if not found
    if (!foundScript) return res.status(400).send("Can't find script file.");

    // return the found script
    res.send(foundScript);
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
