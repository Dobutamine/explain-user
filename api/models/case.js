const Joi = require("joi");
const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  definition: {
    type: String,
  },
  scripts: {
    type: Array,
  },
  protected: {
    type: Boolean,
  },
  shared: {
    type: Boolean,
  },
});

const Case = mongoose.model("Case", caseSchema);

function validateCase(_case) {
  const caseSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    definition: Joi.string(),
    scripts: Joi.array(),
    shared: Joi.boolean(),
    protected: Joi.boolean(),
  });

  return caseSchema.validate(_case);
}

exports.Case = Case;
exports.validate = validateCase;
