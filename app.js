/* eslint-disable no-undef */
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
// eslint-disable-next-line no-unused-vars
const mongoose = require("./mongoose/mongoose-connect");

const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });

const authenticationRouter = require("./routes/authenticate");
const newsRouter = require("./routes/news");
const weatherRouter = require("./routes/weathers");
const homeRouter = require("./routes/home");

const port = process.env.PORT;
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use("/", homeRouter);
app.use("/auth", authenticationRouter);
app.use("/news", newsRouter);
app.use("/weathers", weatherRouter);

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

module.exports = { app };
