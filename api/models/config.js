const Joi = require("joi");
const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
  user: {
    type: String,
  },
  engine_version: {
    type: Number,
  },
  definition: {
    type: String,
  },
  apiUrl: {
    type: String,
  },
  models: {
    type: Object,
  },
  groupers: {
    type: Object,
  },
  charts: {
    type: Object,
  },
  monitors: {
    type: Object,
  },
  dateUpdated: {
    type: Date,
  },
  dateCreated: {
    type: Date,
  },
});

const Config = mongoose.model("Config", configSchema);

function validateConfig(new_config) {
  const configSchema = Joi.object({
    user: Joi.string(),
    engine_version: Joi.number(),
    definition: Joi.string(),
    apiUrl: Joi.string(),
    models: Joi.object(),
    groupers: Joi.object(),
    charts: Joi.object(),
    monitors: Joi.object(),
  });

  return configSchema.validate(new_config);
}

exports.Config = Config;
exports.validate = validateConfig;
