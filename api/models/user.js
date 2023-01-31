const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
  },
  default_engine: {
    type: Number,
  },
  default_engine_name: {
    type: String,
  },
  default_definition: {
    type: String,
  },
  default_config: {
    type: String,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const userSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).email(),
    default_engine: Joi.number(),
    default_engine_name: Joi.string(),
    default_definition: Joi.string(),
    default_config: Joi.string(),
    password: Joi.string().min(5).max(255),
    isAdmin: Joi.boolean(),
  });

  return userSchema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
