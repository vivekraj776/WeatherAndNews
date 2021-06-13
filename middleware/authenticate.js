/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { userModel } = require("../models/user");
const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient();
// client.on("connect", function () {});
const READ_SYS = promisify(client.get).bind(client);
const WRITE_SYS = promisify(client.set).bind(client);

const authenticate = async (request, response, next) => {
  let token = request.header("x-auth");
  if (!token) {
    response.status(400).send("Please Login to Continue");
  }
  const reply = await READ_SYS(token);
  if (reply) {
    request.user = reply;
    request.token = token;
    next();
  } else {
    userModel
      .findByToken(token)
      .then((user) => {
        if (!user) {
          return Promise.reject();
        }
        request.user = user;
        request.token = token;
        next();
      })
      .catch(() => {
        response
          .status(401)
          .send("User may not be registered or check x-auth token");
      });
  }
};

module.exports = { authenticate };
