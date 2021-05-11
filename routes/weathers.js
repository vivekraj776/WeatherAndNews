/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const weather = require('../controllers/weather');

router.get('/report', weather.getWeathers);

module.exports = router;