/* eslint-disable no-undef */
const express = require("express");
const { authenticate } = require("../middleware/authenticate");

const router = express.Router();

router.get("/", authenticate, (request, response) => {
  try {
    let user = request.user;
    response.status(200).send(user);
  } catch (error) {
    response.status(400).send("No user Found");
  }
});

module.exports = router;
