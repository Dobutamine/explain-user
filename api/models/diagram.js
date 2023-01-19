const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const diagramSchema = new mongoose.Schema({
  user: {
    type: String,
    minlength: 3,
    maxlength: 50,
  },
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
  },
  settings: {
    type: Object,
  },
  components: {
    type: Object,
  },
  protected: {
    type: Boolean,
  },
  shared: {
    type: Boolean,
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
    user: Joi.string().min(3).max(50),
    name: Joi.string().min(5).max(50),
    settings: Joi.object(),
    components: Joi.object(),
    shared: Joi.boolean(),
    protected: Joi.boolean(),
  });

  return diagramSchema.validate(diagram);
}

exports.Diagram = Diagram;
exports.validate = validateDiagram;
