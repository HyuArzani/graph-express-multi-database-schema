require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();

const router = require('./src/route');
const graph = require('./src/graph');

if(process.env.NODE_ENV == 'development'){
  app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(graph);
app.use(router);
app.listen(process.env.PORT, ()=>{
  console.log('Listening ... ', process.env.PORT);
});