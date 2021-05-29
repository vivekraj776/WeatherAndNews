/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { userModel } = require("../models/user");
const redis = require("redis");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const client = redis.createClient({
  host: process.env.HOST,
  port: process.env.REDIS_PORT,
});

const READ_SYS = promisify(client.get).bind(client);
const WRITE_SYS = promisify(client.set).bind(client);

const authenticate = async (request, response, next) => {
  let token = request.header("x-auth");
  if (!token) {
    return response.status(400).send("Please Login to Continue");
  }
  const reply = await READ_SYS(token);
  if (reply) {
    request.user = reply;
    request.token = token;
    next();
  } else {
    let userID;
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        console.log(err, "--------");
      }
      userID = decoded;
    });
    userModel
      .findById(userID)
      .then((user) => {
        if (!user) {
          return Promise.reject();
        }
        request.user = user;
        request.token = token;
        next();
      })
      .catch(() => {
        return response
          .status(401)
          .send("User may not be registered or check x-auth token");
      });
  }
};

module.exports = { authenticate };
