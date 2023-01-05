const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const { ModelState, validate } = require("../models/model_state");
const express = require("express");
const _ = require("lodash");
const router = express.Router();

// save a new model state
router.post("/new_state", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);
  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // is this state already registered?
    let state = await ModelState.findOne({ name: req.body.name });
    if (state) return res.status(400).send("Model state exists already.");

    // we have a valid user object so we need to store it in the database
    state = new ModelState(_.pick(req.body, ["_id", "name", "model", "state"]));

    // save the model definition to the database
    await state.save();

    // send a response to the client without the password or account and with a header containing the webtoken
    res.send(_.pick(state, ["_id", "name", "model", "state"]));
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

router.post("/get_state", auth, async (req, res) => {
  // validate the request
  const { error } = validate(req.body);
  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // get the state file
    let state = await ModelState.findOne({ name: req.body.name });

    // if not found
    if (!state) return res.status(400).send("Can't find state file.");

    // check whether the current user is in the owner name list

    res.send(_.pick(definition, ["_id", "name", "model", "state"]));
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
