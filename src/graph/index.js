require('dotenv').config();
const express = require('express');
const router = express.Router();
const graphQl = require('express-graphql');
const schema = require('./schema/schema');

router.use('/graph', graphQl({
  schema,
  graphiql: process.env.NODE_ENV == 'development' ? true : false
}));

module.exports = router;