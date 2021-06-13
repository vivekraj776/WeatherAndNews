/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const helpers = require("../utils/helperFunction");
let request = require("request");
const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient();

const READ_SYS = promisify(client.get).bind(client);
const WRITE_SYS = promisify(client.set).bind(client);

router.get("/report", async (req, res) => {
  try {
    let apiKey = process.env.APP_ID;
    let city = req.query.location;
    let url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    const reply = await READ_SYS("weather");
    if (reply) {
      console.log(reply);
      return res.status(200).send(JSON.parse(reply));
    }
    await request(url, async function (err, response, body) {
      if (err) {
        res.status(400).send("Error while fetching weather", err);
      } else {
        // res.status(200).send(JSON.parse(body));
        let newResult = JSON.parse(body);
        let data = [];
        for (let i = 0; i < 10; i++) {
          let newData = {
            temp: newResult.list[i].main.temp,
            main: newResult.list[i].weather[0].main,
            date: helpers.getFormattedDate(newResult.list[i].dt_txt),
          };
          data.push(newData);
        }
        let finalResult = {
          count: newResult.cnt,
          data,
        };
        const saveResult = await WRITE_SYS(
          "weather",
          JSON.stringify(finalResult),
          "EX",
          50
        );
        return res.status(200).send(finalResult);
      }
    });
  } catch (error) {
    return res.status(400).send("Error while fetching news", error);
  }
});

module.exports = router;
