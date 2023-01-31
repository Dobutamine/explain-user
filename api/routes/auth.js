const { User } = require("../models/user");
const Joi = require("joi");
const mongoose = require("mongoose");
const express = require("express");
const _ = require("lodash");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.post("/", async (req, res) => {
  // validate the request
  const { error } = validate(req.body);
  // if not validate return error message
  if (error) return res.status(400).send(error.details[0].message);

  // does this user exist?
  let user = await User.findOne({ name: req.body.name });
  if (!user) {
    user = await User.findOne({ email: req.body.name });
  }
  if (!user) return res.status(400).send("Invalid username or password");

  // validate the password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Invalid username or password");

  // generate a json web token and set the payload to the user id using the environment variables jwt
  const token = user.generateAuthToken();

  // add the token to the user object
  user["token"] = token;

  // add the las login data
  user.lastLogin = Date.now();

  // we have a valid login so return the json web token to the client
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
});

function validate(req) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
}

module.exports = router;
