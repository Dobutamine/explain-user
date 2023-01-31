const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const { User, validate } = require("../models/user");
const express = require("express");
const _ = require("lodash");
const router = express.Router();
const bcrypt = require("bcryptjs");

// register a new user
router.post("/new_user", async (req, res) => {
  // validate the request
  const { error } = validate(req.body);
  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // is this user already registered?
    let user = await User.findOne({ name: req.body.name });
    if (user) return res.status(400).send("Username already registered.");

    // we have a valid user object so we need to store it in the database
    user = new User(
      _.pick(req.body, [
        "_id",
        "name",
        "password",
        "default_engine",
        "default_engine_name",
        "default_definition",
        "default_config",
        "email",
        "isAdmin",
      ])
    );

    // hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // save the user to the database
    await user.save();

    // generate a json web token and set the payload to the user id using the environment variables jwt
    const token = user.generateAuthToken();

    // add the token to the user object
    user["token"] = token;

    // send a response to the client without the password or account and with a header containing the webtoken
    res.send(
      _.pick(user, [
        "_id",
        "name",
        "email",
        "isAdmin",
        "default_engine",
        "default_engine_name",
        "default_definition",
        "default_config",
        "token",
      ])
    );
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

// get current user -> WORKS
router.get("/me", auth, async (req, res) => {
  try {
    // get the _id from the token and find the user object belonging to that id
    const user = await User.findById(req.user._id).select("-password");
    // if no user is found return an error
    if (!user) {
      return res.status(400).send("No user found.");
    }
    // send the user info without the password
    res.send(user);
  } catch (ex) {
    res.status(500).send("Internal server error.");
  }
});

// update current user -> WORKS
router.put("/me", auth, async (req, res) => {
  try {
    // validate the request
    const { error } = validate(req.body);
    // if not validate return error message
    if (error) return res.status(400).send(error.details[0].message);

    // get the _id from the token and find the user object belonging to that id
    const user = await User.findById(req.user._id);
    // if no user is found return an error
    if (!user) {
      return res.status(400).send("No user found.");
    }

    // update the user info which can be modified
    user.name = req.body.name;
    user.email = req.body.email;

    // save the user to the database
    await user.save();

    // generate a a new json web token and set the payload to the user id using the environment variables jwt
    const token = user.generateAuthToken();

    // add the token to the user object
    user["token"] = token;

    // send a response to the client without the password or account and with a header containing the webtoken
    res.send(
      _.pick(user, [
        "_id",
        "name",
        "email",
        "isAdmin",
        "default_engine",
        "default_engine_name",
        "default_definition",
        "default_config",
        "token",
      ])
    );
  } catch (ex) {
    res.status(500).send("Internal server error.");
  }
});

// ADMIN ACTIONS -> WORKS
// get all users as admin
router.get("/all", [auth, admin], async (req, res) => {
  // get a list of all users
  try {
    const users = await User.find().select("-password");
    // if no user is found return an error
    if (!users) {
      return res.status(400).send("No user found.");
    }

    res.send(users);
  } catch (ex) {
    res.status(500).send("Internal server error.");
  }
});

// get user information as admin
router.get("/:id", [auth, admin], async (req, res) => {
  try {
    // get the _id from the token and find the user object belonging to that id
    const user = await User.findById(req.params.id).select("-password");
    // if no user is found return an error
    if (!user) {
      return res.status(400).send("No user found.");
    }

    res.send(user);
  } catch (ex) {
    res.status(500).send("Internal server error.");
  }
});

// create a new user as admin and create a new token
router.post("/", [auth, admin], async (req, res) => {
  // validate the request
  const { error } = validate(req.body);
  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // is this user already registered?
    let user = await User.findOne({ name: req.body.name });
    if (user) return res.status(400).send("Username already registered.");

    // we have a valid user object so we need to store it in the database
    user = new User(
      _.pick(req.body, [
        "_id",
        "name",
        "password",
        "email",
        "default_engine",
        "default_engine_name",
        "default_definition",
        "default_config",
        "isAdmin",
      ])
    );

    // hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // save the user to the database
    await user.save();

    // generate a json web token and set the payload to the user id using the environment variables jwt
    const token = user.generateAuthToken();

    // add the token to the user object
    user["token"] = token;

    // send a response to the client without the password or account and with a header containing the webtoken
    res.send(
      _.pick(user, [
        "_id",
        "name",
        "email",
        "default_engine",
        "default_engine_name",
        "default_definition",
        "default_config",
        "isAdmin",
        "token",
      ])
    );
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

// change user as an admin and generate a new token
router.put("/:id", [auth, admin], async (req, res) => {
  try {
    // validate the request
    const { error } = validate(req.body);
    // if not validate return error message
    if (error) return res.status(400).send(error.details[0].message);

    // get the _id from the token and find the user object belonging to that id
    const user = await User.findById(req.params.id).select("-password");
    // if no user is found return an error
    if (!user) {
      return res.status(400).send("No user found.");
    }
    // update the user info which can be modified, editHospitals and isAdmin are not allowed
    user.name = req.body.name;
    user.email = req.body.email;
    user.isAdmin = req.body.isAdmin;
    user.default_definition = req.body.default_definition;
    user.default_engine = req.body.default_engine;
    user.default_engine_name = req.body.default_engine_name;
    this.default_config = req.body.default_config;
    // hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    // save the user to the database
    await user.save();

    // generate a a new json web token and set the payload to the user id using the environment variables jwt
    const token = user.generateAuthToken();

    // add the token to the user object
    user["token"] = token;

    // send a response to the client without the password or account and with a header containing the webtoken
    res.send(
      _.pick(user, [
        "_id",
        "name",
        "email",
        "isAdmin",
        "default_engine",
        "default_engine_name",
        "default_definition",
        "default_config",
        "token",
      ])
    );
  } catch (ex) {
    res.status(500).send("Internal server error.");
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    // get the _id from the token and find the user object belonging to that id
    const user = await User.findById(req.params.id).select("-password");
    // if no user is found return an error
    if (!user) {
      return res.status(400).send("No user found.");
    }

    // delete user from database
    await user.delete();

    // inform client
    res.send(`User ${req.params.name} deleted`);
  } catch (ex) {
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
