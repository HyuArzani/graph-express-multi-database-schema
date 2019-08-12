require('babel-register')
require("babel-core/register");
require("babel-polyfill");

require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
// const expressValidator = require('express-validator');
const app = express();

const router = require('./src/route');
const graph = require('./src/graph');

if(process.env.NODE_ENV == 'development'){
  app.use(logger('dev'));
  app.use(cors());
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(expressValidator());
app.use(graph);
app.use(router);
app.listen(process.env.PORT, ()=>{
  console.log('Listening ... ', process.env.PORT);
});