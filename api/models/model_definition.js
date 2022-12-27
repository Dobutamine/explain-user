const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const { object } = require("joi");

const definitionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true,
  },
  owner: {
    type: Array,
    minlength: 5,
    maxlength: 50,
  },
  model: {
    type: Object,
  },
});

definitionSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const ModelDefinition = mongoose.model("ModelDefinition", definitionSchema);

function validateModelDefinition(model_definition) {
  const definitionSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    owner: Joi.array(),
    model: Joi.object(),
  });

  return definitionSchema.validate(model_definition);
}

exports.ModelDefinition = ModelDefinition;
exports.validate = validateModelDefinition;
