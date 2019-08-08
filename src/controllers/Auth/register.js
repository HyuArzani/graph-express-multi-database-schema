require('dotenv').config();
const uuid = require('uuid/v1');
const hash = require('object-hash');
const { getParam, isEmail } = require('functions/common');
const jwt = require('jsonwebtoken');
const knexConfig = require('db/knexfile');
const R = require('ramda');
// const { InsertHelper } = require('functions/dbFunctions');
const knex = require('knex')(knexConfig.development);

const register = async (req, res) => {
  var params = {};
  // check required params
  try {
      params = {
          email: await getParam(req, 'body', 'email'),
          phone: await getParam(req, 'body', 'phone'),
          password: await getParam(req, 'body', 'password', true),
          fullName: await getParam(req, 'body', 'fullName'),
          identityNumber: await getParam(req, 'body', 'identityNumber'),
          nation: await getParam(req, 'body', 'nation'),
          cities: await getParam(req, 'body', 'cities'),
          gender: await getParam(req, 'body', 'gender'),
          dateOfBirth: await getParam(req, 'body', 'dateOfBirth'),
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
  if(!params.email && !params.phone) {
      res.status(422).json({ status: 'FAILED', message: "Missing parameter email or phone" });
      return;
  }
  // check duplicate email
  if(params.email) {
      let userEmail = [];
      try {
          userEmail = await knex('users').where('email', params.email);
      } catch(e) {
          console.error('ERROR WHEN GETTING EMAIL', e);
      }
      if(!isEmail(params.email)) {
        res.status(403).json({ status: 'FAILED', message: "Email format are wrong" });
        return;
      }
      if(!R.isEmpty(userEmail)) {
          res.status(403).json({ status: 'FAILED', message: "Email already registered, please login" });
          return;
      }
  }
  // check duplicate phone
  if(params.phone) {
      let userPhone = [];
      try {
          userPhone = await knex('users').where('phone', params.phone);
      } catch(e) {
          console.error('ERROR WHEN GETTING PHONE', e);
      }
      if(!R.isEmpty(userPhone)) {
          res.status(403).json({ status: 'FAILED', message: "Phone already registered, please login" });
          return;
      }
  }
  // do the database authentication here, with user name and password combination.
  const tokenId = uuid();
  const userId = uuid();
  const response = {
      token: jwt.sign({userId, email: params.email, phone: params.phone, full_name: params.fullName}, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_LIFE}),
      refreshToken: jwt.sign({userId, email: params.email, phone: params.phone, full_name: params.fullName}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_LIFE})
  }
  try {
      await knex('users').insert({
          userId,
          email: params.email,
          phone: params.phone,
          password: hash(params.password),
          full_name: params.fullName,
          identity_number: params.identityNumber,
          nation: params.nation,
          cities: params.cities,
          gender: params.gender,
          origin: params.origin,
          date_of_birth: params.dateOfBirth,
          is_phone_verified: false,
          is_email_verified: false,
      });
  } catch(e) {
      console.error('INSERT INTO TABLE USERS FAILED');
      res.status(500).json({status: 'FAILED', message: 'Insert into table users failed'}); 
  }

  try {
      await Promise.all([
          knex('tokens').insert({
              userId,
              tokenId,
              token: response.token,
              refreshToken: response.refreshToken,
          }),
          knex('userTypes').insert({
              userId,
              tokenId,
              origin: params.origin,
          }),
          knex('verifications').insert({
            verificationId: uuid(),
            userId,
            code: Math.floor(1000 + Math.random() * 9000).toString(),
            type: 'SMS',
            count: 1,
          }),
          knex('verifications').insert({
            verificationId: uuid(),
            userId,
            code: Math.random().toString(36).substring(2,10),//8 random char //Math.floor(Math.random() * (100000000 - 1) + 1),
            type: 'EMAIL',
            count: 1,
          }),
          (params.device || params.os || params.location) ? knex('identifiers').insert({
              identifierId: uuid(),
              userId,
              device: params.device,
              os: params.os,
              location: params.location
          }) : Promise.resolve()
      ])
  } catch(e) {
      console.error('FAILED INSERT TOKEN & VERIFICATION');
      res.status(500).json({status: 'FAILED', message: 'Insert into table tokens/verifications failed'});
  }
  
  res.status(200).json({status: 'OK', data: response});  
}

module.exports = register;