const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const diagramSchema = new mongoose.Schema({
  engine_version: {
    type: Number,
  },
  user: {
    type: String,
  },
  name: {
    type: String,
  },
  definition: {
    type: String,
  },
  protected: {
    type: Boolean,
  },
  shared: {
    type: Boolean,
  },
  settings: {
    type: Object,
  },
  components: {
    type: Object,
  },
  dateUpdated: {
    type: Date,
  },
  dateCreated: {
    type: Date,
  },
});

diagramSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const Diagram = mongoose.model("Diagram", diagramSchema);

function validateDiagram(diagram) {
  const diagramSchema = Joi.object({
    engine_version: Joi.number(),
    user: Joi.string(),
    name: Joi.string(),
    definition: Joi.string(),
    settings: Joi.object(),
    components: Joi.object(),
    shared: Joi.boolean(),
    protected: Joi.boolean(),
  });

  return diagramSchema.validate(diagram);
}

exports.Diagram = Diagram;
exports.validate = validateDiagram;
