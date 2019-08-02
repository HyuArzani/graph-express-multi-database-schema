require('dotenv').config();
const express = require('express');
const graphQl = require('express-graphql');
const schema = require('./schema.js');
const app = express();


app.use('/graph', graphQl({
  schema,
  graphiql: true
}));

app.listen(process.env.PORT)
console.log('Listening ... ', process.env.PORT);