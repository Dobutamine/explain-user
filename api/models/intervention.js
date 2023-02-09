const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const interventionSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  definition: {
    type: String,
  },
  script: {
    type: Array,
  },
  protected: {
    type: Boolean,
  },
  shared: {
    type: Boolean,
  },
});

const Intervention = mongoose.model("Intervention", interventionSchema);

function validateIntervention(_intervention) {
  const interventionSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    definition: Joi.string(),
    script: Joi.array(),
    shared: Joi.boolean(),
    protected: Joi.boolean(),
  });

  return interventionSchema.validate(_intervention);
}

exports.Intervention = Intervention;
exports.validate = validateIntervention;
