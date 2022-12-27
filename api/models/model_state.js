const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const { object } = require("joi");

const stateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true,
  },
  model: {
    type: String,
  },
  state: {
    type: Object,
  },
});

stateSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const ModelState = mongoose.model("ModelState", stateSchema);

function validateModelState(model_state) {
  const stateSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    owner: Joi.array(),
    model: Joi.object(),
  });

  return stateSchema.validate(model_state);
}

exports.ModelState = ModelState;
exports.validate = validateModelState;
