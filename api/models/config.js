const Joi = require("joi");
const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
  user: {
    type: String,
  },
  name: {
    type: String,
  },
  engine_version: {
    type: Number,
  },
  engine_name: {
    type: String,
  },
  definition: {
    type: String,
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
  patient_monitor: {
    type: Object,
  },
  mechanical_ventilator: {
    type: Object,
  },
  trends_monitor: {
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
    name: Joi.string(),
    engine_version: Joi.number(),
    engine_name: Joi.string(),
    definition: Joi.string(),
    groupers: Joi.object(),
    charts: Joi.object(),
    monitors: Joi.object(),
    patient_monitor: Joi.object(),
    mechanical_ventilator: Joi.object(),
    trends_monitor: Joi.object(),
  });

  return configSchema.validate(new_config);
}

exports.Config = Config;
exports.validate = validateConfig;
