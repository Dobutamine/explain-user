const jwt = require("jsonwebtoken");

// this middleware is suppose to be run AFTER the authorization middleware which sets a user object on the request

function admin(req, res, next) {
  // check if user is admin
  if (!req.user.isAdmin) {
    // send the forbidden code (401=unauthorized, 403=forbidden)
    return res.status(403).send("Access denied.");
  }

  next();
}

module.exports = admin;
