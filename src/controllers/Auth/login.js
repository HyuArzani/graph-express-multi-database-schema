require('dotenv').config();
const uuid = require('uuid/v1');
const hash = require('object-hash');
const { getParam, isEmail } = require('functions/common');
const jwt = require('jsonwebtoken');
const knexConfig = require('db/knexfile');
const R = require('ramda');
// const { InsertHelper } = require('functions/dbFunctions');
const knex = require('knex')(knexConfig.development);

const login = async (req, res) => {
  var params = {};
  // check required params
  try {
      params = {
          username: await getParam(req, 'body', 'username', true),
          password: await getParam(req, 'body', 'password', true),
          origin: await getParam(req, 'body', 'origin', true),
          device: await getParam(req, 'body', 'device'),
          os: await getParam(req, 'body', 'os'),
          location: await getParam(req, 'body', 'location'),
      }
  } catch(e) {
      res.status(422).json({
          status: 'FAILED',
          message: e.message
      });
      return;
  }

  let user = [];

  try {
    if(isEmail(params.username))
      user = await knex('users').where('email', params.username);
    else
      user = await knex('users').where('phone', params.username);
  } catch(e) {
    res.status(500).json({ status: 'FAILED', message: "Failed to get User" });
    return;
  }
  if(R.isEmpty(user)) {
    res.status(403).json({ status: 'FAILED', message: "User not found" });
    return;
  }

  const password = hash(params.password);
  user = user[0];
  if(password !== user.password) {
    res.status(401).json({ status: 'FAILED', message: "Invalid password" });
    return;
  }

  const response = {
    userId: user.userId,
    token: jwt.sign({userId: user.userId, email: user.email, phone: user.phone, full_name: user.fullName}, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_LIFE}),
    refreshToken: jwt.sign({userId: user.userId, email: user.email, phone: user.phone, full_name: user.fullName}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_LIFE})
  }
  const tokenId = uuid();
  try {
    await knex('tokens').insert({
      userId: user.userId,
      tokenId,
      token: response.token,
      refreshToken: response.refreshToken,
    })
  
    if(params.device || params.os || params.location) {
      await knex('identifiers').insert({
        identifierId: uuid(),
        userId: user.userId,
        device: params.device,
        os: params.os,
        location: params.location
      })
    }
    let userTypes = await knex('userTypes').where('userId', user.userId);
    if(R.isEmpty(userTypes) && params.origin) {
      await knex('userTypes').insert({
        userId: user.userId,
        tokenId,
        origin: params.origin,
      })
    }
  } catch(e) {
    console.error('FAILED INSERT TOKEN & VERIFICATION');
    res.status(500).json({status: 'FAILED', message: 'Insert into table tokens/verifications failed'});
  }
  
  if((isEmail(params.username) && user.is_email_verified) || (!isEmail(params.username) && user.is_phone_verified)) {
    res.status(200).json({status: 'OK', data: response});
  }

  res.status(202).json({status: 'WARNING', data: response});
}

module.exports = login;