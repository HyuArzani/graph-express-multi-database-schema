require('dotenv').config();
const jwt = require('jsonwebtoken');
const knexConfig = require('db/knexfile');
const R = require('ramda');
const moment = require('moment');
// const { InsertHelper } = require('functions/dbFunctions');
const knex = require('knex')(knexConfig.development);

const tryRefreshToken = async (params) => {
  let tokens = [];
  let users = {};
  const refreshToken = params;
  if(!refreshToken)
    return Promise.reject({
      code: 403,
      status: 'FAILED',
      message: 'Missing refresh-token in headers'
    })
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function(err, decoded) {
    if (err) {
      return Promise.reject({
        code: 403,
        status: 'FAILED',
        message: 'Invalid Refresh Token'
      });
    }
    users = decoded;
    //next();
  });

  try {
    tokens = await knex('tokens').where('refreshToken', refreshToken);
  } catch(e) {
    return Promise.reject({
      code: 500,
      status: 'FAILED',
      message: 'Failed to get Token'
    });
  }

  if(R.isEmpty(tokens)) {
    return Promise.reject({
      code: 403,
      status: 'FAILED',
      message: 'Refresh Token not found'
    });
  }
  
  let response = {
    userId: users.userId,
    token: jwt.sign({userId: users.userId, email: users.email, phone: users.phone, full_name: users.fullName}, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_LIFE}),
    refreshToken: refreshToken
  };

  try {
    await knex('tokens').update({
      token: response.token,
      updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    }).where('tokenId', tokens[0].tokenId);
  } catch(e) {
    return Promise.reject({
      code: 500,
      status: 'FAILED',
      message: 'Failed to Update Token'
    });
  }

  return Promise.resolve({
    code: 200,
    status: 'OK',
    data: response
  });
}

module.exports = tryRefreshToken