const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const debug = require("debug")("app:debug");
const { Diagram, validate } = require("../models/diagram");
const express = require("express");
const _ = require("lodash");
const router = express.Router();

// save a new model state
router.post("/delete_diagram", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);
  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // is this script already registered?
    let newDiagram = await Diagram.deleteOne({
      name: req.body.name,
      user: req.body.user,
      protected: false,
    });

    // send a response to the client without the password or account and with a header containing the webtoken
    if (newDiagram.deletedCount > 0) {
      res.send('{ "message" : "success" }');
    } else {
      res.send('{ "message" : "error" }');
    }
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

router.post("/update_diagram", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);
  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // is this script already registered?
    let newDiagram = await Diagram.findOne({
      name: req.body.name,
      user: req.body.user,
    });

    if (!newDiagram) {
      // this script does not exist yet so make a new one
      // we have a valid user object so we need to store it in the database
      newDiagram = new Diagram(
        _.pick(req.body, [
          "_id",
          "engine_version",
          "engine_name",
          "user",
          "name",
          "definition",
          "settings",
          "components",
          "protected",
          "shared",
        ])
      );
      // add the creation date
      newDiagram["dateCreated"] = Date.now();
      newDiagram["dateUpdated"] = Date.now();

      // save the model definition to the database
      await newDiagram.save();

      res.send('{ "message" : "new" }');

      return;
    }

    newDiagram["dateUpdated"] = Date.now();

    // save the model definition to the database
    await newDiagram.updateOne({
      engine_version: req.body.engine_version,
      engine_name: req.body.engine_name,
      user: req.body.user,
      name: req.body.name,
      definition: req.body.definition,
      settings: req.body.settings,
      components: req.body.components,
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

// get all diagrams for the current user
router.post("/get_diagrams", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);

  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // get the diagram file
    let foundDiagrams = await Diagram.find({
      $or: [{ user: req.body.user }, { shared: true }],
    });

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
      $or: [
        { name: req.body.name, user: req.body.user },
        { name: req.body.name, shared: true },
      ],
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
