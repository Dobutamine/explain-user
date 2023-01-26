const Joi = require("joi");
const mongoose = require("mongoose");

const definitionSchema = new mongoose.Schema({
  engine_version: {
    type: Number,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  weight: {
    type: Number,
  },
  user: {
    type: String,
  },
  protected: {
    type: Boolean,
  },
  shared: {
    type: Boolean,
  },
  models: {
    type: Object,
  },
  dateUpdated: {
    type: Date,
  },
  dateCreated: {
    type: Date,
  },
});

const Definition = mongoose.model("Definition", definitionSchema);

function validateDefinition(newDefinition) {
  const definitionSchema = Joi.object({
    engine_version: Joi.number(),
    name: Joi.string(),
    description: Joi.string(),
    user: Joi.string(),
    weight: Joi.number(),
    protected: Joi.boolean(),
    shared: Joi.boolean(),
    models: Joi.object(),
  });

  return definitionSchema.validate(newDefinition);
}

exports.Definition = Definition;
exports.validate = validateDefinition;
