const Joi = require("joi");
const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  engine_version: {
    type: Number,
  },
  modeling_stepsize: {
    type: Number,
  },
  base_model_settings: {
    type: Object,
  },
  active_experimental_models: {
    type: Array,
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

const Setting = mongoose.model("Setting", settingSchema);

function validateSetting(new_setting) {
  const settingSchema = Joi.object({
    engine_version: Joi.number(),
    modeling_stepsize: Joi.number(),
    base_model_settings: Joi.object(),
    active_experimental_models: Joi.array(),
    core_models: Joi.object(),
    experimental_models: Joi.object(),
  });

  return settingSchema.validate(new_setting);
}

exports.Setting = Setting;
exports.validate = validateSetting;
