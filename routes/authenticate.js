/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const { authenticate } = require("./../middleware/authenticate.js");
const { userModel } = require("../models/user");
const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient({
  host: process.env.HOST,
  port: process.env.REDIS_PORT,
});

const READ_SYS = promisify(client.get).bind(client);
const WRITE_SYS = promisify(client.set).bind(client);

router.post("/signup", (request, response) => {
  const { name, password, email } = request.body;
  const newUser = new userModel({
    name,
    password,
    email,
  });

  newUser
    .save()
    .then(() => {
      return newUser.generateAuthToken();
    })
    .then(() => {
      response.status(200).send(newUser);
    })
    .catch((e) => {
      console.log(e);
      response.status(400).send("Error Registering User");
    });
});

router.post("/login", async (request, response) => {
  const { password, email } = request.body;
  userModel
    .findByCredentials(email, password)
    .then(async (user) => {
      if (!user) {
        return response.status(400).send("No Such User Found");
      }
      user.generateAuthToken().then(async (result) => {
        const newResult = await WRITE_SYS(
          result,
          JSON.stringify(user),
          "EX",
          3000
        );
        const newResponse = {
          message: "You are succesfully logged In",
          user: user,
        };
        return response.status(200).send(newResponse);
      });
    })
    .catch(() => {
      response.status(400).send("Error Logging in!");
    });
});

router.delete("/logout", authenticate, (request, response) => {
  let user = request.user;
  let token = request.token;
  user
    .removeToken(token)
    .then(() => {
      response.status(200).send("You have been logged out succesfully!");
    })
    .catch(() => {
      response.status(400).send("Error Logging Out!");
    });
});

module.exports = router;
