require('dotenv').config();
const uuid = require('uuid/v1');
const hash = require('object-hash');
const { getParam } = require('functions/common');
const jwt = require('jsonwebtoken');
const knexConfig = require('db/knexfile');
const R = require('ramda');
// const { InsertHelper } = require('functions/dbFunctions');
const knex = require('knex')(knexConfig.development);

const tryRefreshToken = (req, res) => {
  // refresh the damn token
  const postData = req.body
  // if refresh token exists
  if((postData.refreshToken) && (postData.refreshToken in tokenList)) {
      const user = {
          "email": postData.email,
          "name": postData.name
      }
      const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife})
      const response = {
          "token": token,
      }
      // update the token in the list
      tokenList[postData.refreshToken].token = token
      res.status(200).json(response);        
  } else {
      res.status(404).send('Invalid request')
  }
}

module.exports = tryRefreshToken