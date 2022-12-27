const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  try {
    // get the token from the body
    const token = req.query.token; // req.body("token");

    // if there's no token in the header stop the request pipeline
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }

    // if there is a token we have to verify it
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;

    next();
  } catch (ex) {
    return res.status(400).send("Access denied. Invalid token.");
  }
}

module.exports = auth;
