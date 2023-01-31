const Joi = require("joi");
const mongoose = require("mongoose");

const engineSchema = new mongoose.Schema({
  engine_version: {
    type: Number,
  },
  engine_name: {
    type: String,
  },
  modeling_stepsize: {
    type: Number,
  },
  base_model_settings: {
    type: Object,
  },
  experimental_models: {
    type: Boolean,
  },
  core_models: {
    type: Object,
  },
  experimental_models: {
    type: Object,
  },
  dateUpdated: {
    type: Date,
  },
  dateCreated: {
    type: Date,
  },
});

const Engine = mongoose.model("Engine", engineSchema);

function validateEngine(new_engine) {
  const engineSchema = Joi.object({
    engine_version: Joi.number(),
    engine_name: Joi.string(),
    modeling_stepsize: Joi.number(),
    base_model_settings: Joi.object(),
    experimental_models: Joi.boolean(),
    core_models: Joi.object(),
    experimental_models: Joi.object(),
  });

  return engineSchema.validate(new_engine);
}

exports.Engine = Engine;
exports.validate = validateEngine;
