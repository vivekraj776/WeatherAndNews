/* eslint-disable no-undef */
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/TechAlchemyTest',{useNewUrlParser:true},{ useUnifiedTopology: true });         //localhost where moongoose is stored

module.exports = {mongoose};