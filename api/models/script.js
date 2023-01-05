const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const scriptSchema = new mongoose.Schema({
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

scriptSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const Script = mongoose.model("Script", scriptSchema);

function validateScript(script) {
  const scriptSchema = Joi.object({
    user: Joi.string().min(3).max(50),
    name: Joi.string().min(3).max(50),
    script: Joi.array(),
    shared: Joi.boolean(),
    protected: Joi.boolean(),
  });

  return scriptSchema.validate(script);
}

exports.Script = Script;
exports.validate = validateScript;
