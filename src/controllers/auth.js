const config = require('../config');
const jwt = require('jsonwebtoken');

const login = (req, res) => {
  const postData = req.body;
  const user = {
      "email": postData.email,
      "name": postData.name
  }
  // do the database authentication here, with user name and password combination.
  const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife})
  const refreshToken = jwt.sign(user, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife})
  const response = {
      "status": "Logged in",
      "token": token,
      "refreshToken": refreshToken,
  }
  // get users from database
  // assert.property(req, 'knex')
  // tokenList[refreshToken] = response
  res.status(200).json(response);
}

const refreshToken = (req, res) => {
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

module.exports = {
  login,
  refreshToken
}