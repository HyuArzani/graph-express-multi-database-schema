require('dotenv').config();
const uuid = require('uuid/v1');
const hash = require('object-hash');
const { getParam, isEmail } = require('functions/common');
const jwt = require('jsonwebtoken');
const knexConfig = require('db/knexfile');
const R = require('ramda');
// const { InsertHelper } = require('functions/dbFunctions');
const knex = require('knex')(knexConfig.development);

const tryLogin = async (params) => {
  // const origin = params.origin;
  if(!params.origin) {
    return Promise.reject({
      code: 422,
      status: 'FAILED',
      message: 'Missing Parameters Origin'
    });
  }
  let user = [];
  // check if user exist
  try {
    user = await knex('users').where('email', params.username).orWhere('phone', params.username);
  } catch(e) {
    return Promise.reject({
      code: 500,
      status: 'FAILED',
      message: 'Failed to get User'
    });
  }
  if(R.isEmpty(user)) {
    return Promise.reject({
      code: 403,
      status: 'FAILED',
      message: 'User not found'
    });
  }
  // check password
  const password = hash(params.password);
  user = user[0];
  if(password !== user.password) {
    return Promise.reject({
      code: 401,
      status: 'FAILED',
      message: 'Invalid password'
    });
  }
  let response = {
    userId: user.userId,
    token: jwt.sign({userId: user.userId, email: user.email, phone: user.phone, full_name: user.fullName}, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_LIFE}),
    refreshToken: jwt.sign({userId: user.userId, email: user.email, phone: user.phone, full_name: user.fullName}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_LIFE})
  };
  //store session data in database
  const tokenId = uuid();
  try {
    await knex('tokens').insert({
      userId: user.userId,
      tokenId,
      token: response.token,
      refreshToken: response.refreshToken,
    })
  
    await Promise.all([
      async () => {
        if(params.device || params.os || params.location) {
          await knex('identifiers').insert({
            identifierId: uuid(),
            userId: user.userId,
            device: params.device,
            os: params.os,
            location: params.location
          })
        }
      },
      async () => {
        let userTypes = [];
        if(params.origin)
          userTypes = await knex('userTypes').where('userId', user.userId).where('origin', params.origin);
        else
          userTypes = await knex('userTypes').where('userId', user.userId);
        if(R.isEmpty(userTypes)) {
          await knex('userTypes').insert({
            userId: user.userId,
            tokenId,
            origin: params.origin,
          })
        }
      },
    ])
  } catch(e) {
    return Promise.reject({
      code: 500,
      status: 'FAILED',
      message: 'Insert into table tokens/verifications failed'
    });
  }
  
  if((isEmail(params.username) && user.is_email_verified) || (!isEmail(params.username) && user.is_phone_verified)) {
    return Promise.resolve({
      code: 200,
      status: 'OK',
      data: response
    });
  }

  return Promise.resolve({
    code: 202,
    status: 'WARNING',
    data: response
  });
}

module.exports = tryLogin